function clampBrightness(value) {
  return Math.min(100, Math.max(0, value))
}

function notifyState(self) {
  if (typeof self.checkVariables === 'function') self.checkVariables()
  if (typeof self.checkFeedbacks === 'function') self.checkFeedbacks()
}

function setCommandError(self, error = null) {
  self.brightnessCommandError = error ? error.message || error.error || String(error) : ''
  notifyState(self)
}

function setFadeRunning(self, running) {
  self.brightnessFadeRunning = Boolean(running)
  notifyState(self)
}

function parseBrightness(value) {
  const requested = Number(String(value).trim().replace(/%$/, ''))
  if (!Number.isFinite(requested)) throw new Error(`Invalid brightness value "${value}"`)
  return clampBrightness(requested)
}

function parseDurationMinutes(value) {
  const duration = Number(String(value).trim())
  if (!Number.isFinite(duration) || duration < 0) {
    throw new Error(`Invalid fade duration "${value}"`)
  }
  return duration
}

function parseEnabled(value) {
  const normalized = String(value ?? '1').trim().toLowerCase()
  return !['', '0', 'false', 'off', 'no', 'null', 'undefined'].includes(normalized)
}

async function parseVariableOption(context, value) {
  return context.parseVariablesInString(String(value ?? ''))
}

async function writeBrightness(self, value) {
  const brightness = clampBrightness(Number(value))
  if (!self.novastar) throw new Error('NovaStar is not connected')

  // screenbrightness accepts a normalized value. Sending one consistently
  // prevents 1% from being interpreted as the normalized value 1.0 (100%).
  if (typeof self.novastar.screenbrightness === 'function') {
    return self.novastar.screenbrightness(brightness / 100, null)
  }
  return self.novastar.brightness(brightness, null)
}

async function readBrightness(self) {
  if (!self.novastar) throw new Error('NovaStar is not connected')
  const displayParams = await self.novastar.getDisplayParams()
  const raw = Number(displayParams?.[0]?.brightness)
  if (!Number.isFinite(raw)) throw new Error('No valid brightness feedback is available')
  return clampBrightness(raw <= 1 ? raw * 100 : raw)
}

function stopBrightnessFade(self, logCancellation = false) {
  self.brightnessFadeGeneration = (self.brightnessFadeGeneration || 0) + 1
  const wasRunning = Boolean(self.brightnessFadeTimer || self.brightnessFadeRunning)

  if (self.brightnessFadeTimer) {
    clearTimeout(self.brightnessFadeTimer)
    self.brightnessFadeTimer = null
  }

  if (wasRunning && logCancellation) self.log('info', 'Brightness fade cancelled')
  setFadeRunning(self, false)
  return wasRunning
}

async function setBrightness(self, value, description = 'Set Brightness') {
  const brightness = clampBrightness(Number(value))
  stopBrightnessFade(self, false)

  try {
    await writeBrightness(self, brightness)
    self.log('info', `${description}: ${brightness}`)
    setCommandError(self)
    return true
  } catch (error) {
    self.log('error', `${description} failed: ${error.message || error.error || error}`)
    setCommandError(self, error)
    return false
  }
}

async function adjustBrightness(self, amount, description = 'Adjust Brightness') {
  const adjustment = Number(amount)
  if (!Number.isFinite(adjustment)) {
    const error = new Error(`Invalid brightness adjustment "${amount}"`)
    self.log('warn', error.message)
    setCommandError(self, error)
    return false
  }

  stopBrightnessFade(self, false)
  try {
    const current = await readBrightness(self)
    const brightness = clampBrightness(current + adjustment)
    await writeBrightness(self, brightness)
    self.log('info', `${description}: ${current} by ${adjustment} to ${brightness}`)
    setCommandError(self)
    return true
  } catch (error) {
    self.log('error', `${description} failed: ${error.message || error.error || error}`)
    setCommandError(self, error)
    return false
  }
}

async function startBrightnessFade(self, targetValue, durationSeconds) {
  const target = clampBrightness(Number(targetValue))
  const duration = Number(durationSeconds)
  stopBrightnessFade(self, false)
  const generation = self.brightnessFadeGeneration

  try {
    const start = await readBrightness(self)
    const durationMs = duration * 1000

    if (durationMs === 0 || Math.round(start) === Math.round(target)) {
      await writeBrightness(self, target)
      setCommandError(self)
      setFadeRunning(self, false)
      self.log('info', `Brightness set to ${target}`)
      return true
    }

    const startedAt = Date.now()
    let lastBrightness = Math.round(start)
    setCommandError(self)
    setFadeRunning(self, true)
    self.log('info', `Fading brightness from ${start} to ${target} over ${duration} seconds`)

    const updateFade = async () => {
      if (generation !== self.brightnessFadeGeneration) return
      const progress = Math.min(1, (Date.now() - startedAt) / durationMs)
      const brightness = progress === 1 ? target : Math.round(start + (target - start) * progress)

      try {
        if (brightness !== lastBrightness || progress === 1) {
          await writeBrightness(self, brightness)
          lastBrightness = brightness
        }

        if (generation !== self.brightnessFadeGeneration) return
        if (progress < 1) {
          self.brightnessFadeTimer = setTimeout(updateFade, 1000)
        } else {
          self.brightnessFadeTimer = null
          setFadeRunning(self, false)
          setCommandError(self)
          self.log('info', `Brightness fade completed at ${target}`)
        }
      } catch (error) {
        self.brightnessFadeTimer = null
        setFadeRunning(self, false)
        setCommandError(self, error)
        self.log('error', `Brightness fade failed: ${error.message || error.error || error}`)
      }
    }

    self.brightnessFadeTimer = setTimeout(updateFade, 1000)
    return true
  } catch (error) {
    setFadeRunning(self, false)
    setCommandError(self, error)
    self.log('error', `Error starting brightness fade: ${error.message || error.error || error}`)
    return false
  }
}

function variableTextOption(id, label, defaultValue, tooltip) {
  return {
    id,
    type: 'textinput',
    label,
    default: defaultValue,
    tooltip,
    useVariables: true,
  }
}

function getConditionalActionDefinitions(self) {
  const enabledOption = variableTextOption(
    'enabled',
    'Enabled',
    '1',
    'Accepts a variable or expression result. Empty, 0, false, off, or no skips the action.'
  )

  return {
    brightness_set_conditional: {
      name: 'Set Brightness If Enabled',
      options: [
        enabledOption,
        variableTextOption('brightness', 'Brightness', '50', 'Brightness from 0-100 or a variable.'),
      ],
      callback: async (event, context) => {
        const enabled = await parseVariableOption(context, event.options.enabled)
        if (!parseEnabled(enabled)) return

        try {
          const value = await parseVariableOption(context, event.options.brightness)
          await setBrightness(self, parseBrightness(value), 'Conditional Brightness')
        } catch (error) {
          setCommandError(self, error)
          self.log('error', error.message || String(error))
        }
      },
    },
    brightness_adjust_conditional: {
      name: 'Adjust Brightness If Enabled',
      options: [
        enabledOption,
        variableTextOption('amount', 'Adjustment', '1', 'Adjustment amount or a variable.'),
      ],
      callback: async (event, context) => {
        const enabled = await parseVariableOption(context, event.options.enabled)
        if (!parseEnabled(enabled)) return

        const amount = await parseVariableOption(context, event.options.amount)
        await adjustBrightness(self, amount, 'Conditional Brightness Adjustment')
      },
    },
    brightness_fade_conditional: {
      name: 'Fade Brightness If Enabled',
      options: [
        enabledOption,
        variableTextOption('target', 'Target Brightness', '75', 'Target from 0-100 or a variable.'),
        variableTextOption('duration', 'Duration in Minutes', '15', 'Duration in minutes or a variable.'),
      ],
      callback: async (event, context) => {
        const enabled = await parseVariableOption(context, event.options.enabled)
        if (!parseEnabled(enabled)) return

        try {
          const targetValue = await parseVariableOption(context, event.options.target)
          const durationValue = await parseVariableOption(context, event.options.duration)
          const target = parseBrightness(targetValue)
          const duration = parseDurationMinutes(durationValue)
          await startBrightnessFade(self, target, duration * 60)
        } catch (error) {
          setCommandError(self, error)
          self.log('error', error.message || String(error))
        }
      },
    },
    brightness_fade_stop: {
      name: 'Stop Brightness Fade',
      options: [],
      callback: () => stopBrightnessFade(self, true),
    },
  }
}

module.exports = {
  adjustBrightness,
  getConditionalActionDefinitions,
  parseBrightness,
  parseDurationMinutes,
  setBrightness,
  setCommandError,
  startBrightnessFade,
  stopBrightnessFade,
}
