# NovaStar COEX Brightness Page — Quick Start

Choose the configuration matching the number of NovaStar MX40 controllers. Each MX40 uses its own Companion module instance and IP address.

## 1. Back Up Companion

Each `*_MX40_brightness_page.companionconfig` file is a **full Companion configuration**. Importing it replaces the current configuration.

Create a Companion backup before importing it.

## 2. Import and Connect

1. Import the file matching the required number of MX40s, from `1_MX40_brightness_page.companionconfig` through `10_MX40_brightness_page.companionconfig`.
2. Open **Connections** and select each NovaStar COEX connection.
3. Enter a unique MX40 **Target IP** for every connection.
4. Enter the desired **Screen Name** for each MX40. The brightness page buttons use this name.
5. Leave the port at `8001` unless the controller uses a different port.
6. Confirm the connection reports **OK**.

Connections are labeled `novastar-coex-1` through `novastar-coex-10` as needed.

When connected, each screen displays its live brightness percentage. `--%` means that screen's live feedback is unavailable.

## 3. Direct Brightness Editing

- Press **All Direct Edit** or the required screen's **Direct Edit** button.
- Turn either rotary encoder to adjust brightness by 1% per step.
- The brightness presets become green.
- Press **Previous Brightness** to restore the previously captured brightness.

Pressing any non-Direct Edit button deselects all Direct Edit buttons after that button's action runs.

## 4. Configure a Fade

1. Press the required screen's **Fade** button or **Fade All**.
2. Press the **Target** button. Use either rotary or an amber preset to choose the target percentage.
3. Press the **Time** button. Use either rotary or a purple preset to choose the duration.
4. Press **Execute Fade**.

The supplied time presets are:

- 15 minutes
- 30 minutes
- 1 hour
- 1 hour 30 minutes
- 5 hours

Press **Stop Fade** at any time. The MX40 remains at its current brightness.

## 5. Previous Values

The Previous button follows the active family:

- Green: **Previous Brightness**
- Amber: **Previous Target**
- Purple: **Previous Time**

Target and time values swap with their previous values, allowing the button to toggle between the two most recent settings.

## 6. Edit a Preset

1. Select the preset family:
   - Select a Direct Edit button for brightness presets.
   - Press **Target** for target presets.
   - Press **Time** for time presets.
2. Hold the preset slot to enter edit mode with that preset selected.
3. Turn either rotary encoder to change its value.
4. Hold the selected preset to save only that preset.
5. Press **Save ALL & Exit Edit** to save the active edit value and leave edit mode.
6. Press **Discard Changes** to leave edit mode without saving the active edit value.

The active edit slot flashes with a lighter shade of its green, amber, or purple family.

## 7. Color Guide

| Color | Meaning |
|---|---|
| Green | Direct brightness editing |
| Amber | Fade target editing |
| Purple | Fade time editing |
| Dark family shade | Preset or Previous value |
| Full family shade | Rotary encoder or active editor |
| Lighter flashing shade | Active preset-edit slot |
| Pulsing green | Fade running |
| Gray | MX40 feedback offline |
| Red | Brightness command error |

Offline gray and error red override the normal family colors.

## 8. Quick Troubleshooting

**Brightness displays `--%`**

- Confirm the MX40 IP and port.
- Confirm Companion and the MX40 are on reachable networks.
- Check the NovaStar connection status in Companion.

**A button turns red**

- Companion received a brightness command error.
- Check the connection, then retry a brightness command. A successful command clears the error.

**Brightness presets or rotaries do nothing**

- Select at least one screen's **Direct Edit** button first.

**Execute Fade does nothing**

- Select at least one screen's **Fade** button first.
- Confirm the screen is online and shows a percentage instead of `--%`.

## 9. Multiple MX40s

Ready-to-import configurations are provided for one through ten MX40s. Every shared rotary, preset, Previous, Stop, and Execute control already contains the actions required for all instances in that file.
