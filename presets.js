module.exports = function (self) {
  const createBrightnessPreset = (name, amount) => ({
    type: 'button',
    category: 'Brightness',
    name,
    style: {
      text: `Brightness\n${amount > 0 ? '+' : ''}${amount}`,
      size: '14',
      color: 0xffffff,
      bgcolor: 0x000000,
    },
    feedbacks: [],
    steps: [
      {
        down: [
          {
            actionId: 'brightness_adjust',
            options: { amount },
          },
        ],
        up: [],
      },
    ],
  })

  self.setPresetDefinitions({
    brightness_increment_1: createBrightnessPreset('Increase Brightness by 1', 1),
    brightness_decrement_1: createBrightnessPreset('Decrease Brightness by 1', -1),
    brightness_increment_5: createBrightnessPreset('Increase Brightness by 5', 5),
    brightness_decrement_5: createBrightnessPreset('Decrease Brightness by 5', -5),
    brightness_increment_10: createBrightnessPreset('Increase Brightness by 10', 10),
    brightness_decrement_10: createBrightnessPreset('Decrease Brightness by 10', -10),
    brightness_current: {
      type: 'button',
      category: 'Brightness',
      name: 'Current Brightness',
      style: {
        text: '$(this:screen_0_name)\n$(this:screen_0_brightness)',
        size: '30',
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      feedbacks: [],
      steps: [
        {
          down: [],
          up: [],
        },
      ],
    },
    brightness_rotary: {
      type: 'button',
      category: 'Brightness',
      name: 'Brightness Rotary',
      options: {
        rotaryActions: true,
      },
      style: {
        text: '$(this:screen_0_name)\n$(this:screen_0_brightness)',
        size: '14',
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      feedbacks: [],
      steps: [
        {
          down: [],
          up: [],
          rotate_left: [
            {
              actionId: 'brightness_adjust',
              options: { amount: -1 },
            },
          ],
          rotate_right: [
            {
              actionId: 'brightness_adjust',
              options: { amount: 1 },
            },
          ],
        },
      ],
    },
    brightness_fade_15_60: {
      type: 'button',
      category: 'Brightness',
      name: 'Fade Brightness to 15 over 60 Minutes',
      style: {
        text: 'Fade to 15%\n60 min',
        size: '14',
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      feedbacks: [],
      steps: [
        {
          down: [
            {
              actionId: 'brightness_fade',
              options: {
                target: '15',
                duration: '60',
              },
            },
          ],
          up: [],
        },
      ],
    },
  })
}
