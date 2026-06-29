module.exports = async function (self) {
  const variableDefinitions = [
    {
      variableId: 'screen_0_id',
      name: 'Screen 1 ID',
    },
    {
      variableId: 'screen_0_name',
      name: 'Screen 1 Name',
    },
    {
      variableId: 'screen_0_brightness',
      name: 'Screen 1 Brightness',
    },
    {
      variableId: 'screen_0_colortemp',
      name: 'Screen 1 Color Temperature',
    },
    {
      variableId: 'screen_0_gamma',
      name: 'Screen 1 Gamma',
    },
    {
      variableId: 'brightness_feedback_valid',
      name: 'Brightness Feedback Valid',
    },
    {
      variableId: 'brightness_fade_running',
      name: 'Brightness Fade Running',
    },
    {
      variableId: 'brightness_fade_remaining',
      name: 'Brightness Fade Remaining',
    },
    {
      variableId: 'brightness_fade_remaining_seconds',
      name: 'Brightness Fade Remaining Seconds',
    },
    {
      variableId: 'brightness_command_error',
      name: 'Latest Brightness Command Error',
    },
  ]

  // Check if displayParams exists and is an array
  if (Array.isArray(self.displayParams)) {
    self.displayParams.forEach((param, index) => {
      if (index === 0) return
      const screenLabel = `Screen ${index + 1}` // Use index for label as ID might be long/complex

      // Add variable for Screen ID (optional, but potentially useful)
      variableDefinitions.push({
        variableId: `screen_${index}_id`,
        name: `${screenLabel} ID`,
      })

      variableDefinitions.push({
        variableId: `screen_${index}_name`,
        name: `${screenLabel} Name`,
      })

      // Add variable for Brightness
      variableDefinitions.push({
        variableId: `screen_${index}_brightness`,
        name: `${screenLabel} Brightness`,
      })

      // Add variable for Color Temperature
      variableDefinitions.push({
        variableId: `screen_${index}_colortemp`,
        name: `${screenLabel} Color Temperature`,
      })

      // Add variable for Gamma
      variableDefinitions.push({
        variableId: `screen_${index}_gamma`,
        name: `${screenLabel} Gamma`,
      })
    })
    // Add variable for Current Preset Name
    variableDefinitions.push({
      variableId: 'current_preset_name',
      name: 'Current Preset Name',
    })
    // Add variable for Display State
    variableDefinitions.push({
      variableId: 'display_state',
      name: 'Current Display State',
    })

  }

  self.setVariableDefinitions(variableDefinitions)
}
