# NovaStar COEX MX40 Brightness Page - Quick Start

This repo contains the `companion-module-novastar-coex` module plus ready-to-import Companion brightness-page configs for one through ten NovaStar MX40 controllers.

The configs are full Companion v4 exports generated from Companion `4.3.4+9244-stable-c14e5e3334`. Importing one replaces the current Companion configuration, creates page `1` named `PAGE`, and adds one enabled NovaStar COEX module instance for each MX40.

## 1. Choose a Config

Pick the file matching the number of MX40s in the setup.

| MX40s | File | Imported connection labels |
|---:|---|---|
| 1 | `1_MX40_brightness_page.companionconfig` | `novastar-coex-1` |
| 2 | `2_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-2` |
| 3 | `3_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-3` |
| 4 | `4_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-4` |
| 5 | `5_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-5` |
| 6 | `6_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-6` |
| 7 | `7_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-7` |
| 8 | `8_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-8` |
| 9 | `9_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-9` |
| 10 | `10_MX40_brightness_page.companionconfig` | `novastar-coex-1` through `novastar-coex-10` |

Each MX40 uses its own Companion module instance and IP address.

## 2. Back Up Companion

Each `*_MX40_brightness_page.companionconfig` file is a full Companion configuration, not a single-page add-on.

Create a Companion backup before importing.

## 3. Import and Connect

1. Import the chosen `.companionconfig` file.
2. Open **Connections**.
3. Select `novastar-coex-1`.
4. Enter that MX40's **Target IP**.
5. Leave **Target Port** at `8001` unless the controller uses a different port.
6. Enter a unique **Screen Name**. The brightness page uses this name on the Fade and Direct Edit buttons.
7. Repeat for every imported connection through `novastar-coex-N`.
8. Confirm each connection reports **OK**.

The exported instances reference module ID `novastar-coex` and module version `dev`, so Companion should be running this local module repo as a development module or an equivalent installed build.

The exported instances do not store Target IP, Target Port, or Screen Name values. If a Screen Name is left blank, each instance falls back to `Screen 1`, so name every MX40 before using the page.

## 4. Numbering Rules

Operator-facing names are 1-based:

- Config files: `1_MX40...` through `10_MX40...`
- Connection labels: `novastar-coex-1` through `novastar-coex-10`
- Recommended Screen Names: `Screen 1`, `Screen 2`, or venue-specific names such as `Main Wall`
- Page custom variables for lane state: `novastar_coex_1_direct_edit_selected`, `novastar_coex_1_fade_selected`, and so on

The module ID remains `novastar-coex`; do not rename that in the module manifest.

The module variables remain 0-based inside each instance. For example, MX40 3's visible brightness is `$(novastar-coex-3:screen_0_brightness)`. In that expression, `screen_0_brightness` means the first screen reported by that one MX40 module instance, not MX40 number zero.

## 5. Page Layout

The imported page uses two rows of controls.

Top row:

- Left rotary
- **Fade All**
- Per-screen **Fade** buttons using each connection's Screen Name
- **Previous Brightness**, **Previous Target**, **Previous Time**, or **Save ALL & Exit Edit**
- Presets `2` and `4`
- **Target**
- **Stop Fade** or **Discard Changes**
- Right rotary

Bottom row:

- **All Direct Edit**
- Per-screen **Direct Edit** buttons using each connection's Screen Name
- Presets `1`, `3`, and `5`
- **Time**
- **Execute Fade**

Both rotaries perform the same action. Their behavior follows the active mode.

## 6. Direct Brightness

1. Press **All Direct Edit** or one or more screen **Direct Edit** buttons.
2. Turn either rotary to adjust selected screens by `1%` per step.
3. Press a green brightness preset to set selected screens to that value.
4. Press **Previous Brightness** to restore the previously captured brightness.

Default brightness presets are `0%`, `25%`, `50%`, `75%`, and `90%`.

Pressing any non-Direct Edit button deselects all Direct Edit buttons after that button's action runs. Rotary turns do not clear the Direct Edit selection.

## 7. Fade Brightness

1. Press **Fade All** or one or more screen **Fade** buttons.
2. Press **Target** and use either rotary or an amber preset to choose the target percentage.
3. Press **Time** and use either rotary or a purple preset to choose the duration.
4. Press **Execute Fade**.

The current default target is `50%`.

Default target presets are `0%`, `25%`, `50%`, `75%`, and `90%`.

Fade time is stored in seconds and displayed as seconds, minutes, or hours as needed. The default time is `60s`.

Default time presets are:

- `30s`
- `1m`
- `5m`
- `30m`
- `1h`

Press **Stop Fade** at any time. The MX40 remains at its current brightness. While a fade is running, that screen's Fade button shows the remaining time instead of brightness.

## 8. Previous Values

The Previous button follows the active family:

| Active family | Button label | Behavior |
|---|---|---|
| Green | **Previous Brightness** | Restores each selected screen's captured previous brightness |
| Amber | **Previous Target** | Swaps the current and previous target percentage |
| Purple | **Previous Time** | Swaps the current and previous fade duration |

Target and time values swap with their previous values, allowing the button to toggle between the two most recent settings.

## 9. Edit Presets

1. Select the preset family:
   - Select a Direct Edit button for brightness presets.
   - Press **Target** for target presets.
   - Press **Time** for time presets.
2. Hold the preset slot for `2 seconds` to enter edit mode with that preset selected.
3. Turn either rotary to change the active edit value.
4. Hold the selected preset for `2 seconds` to save only that preset and exit edit mode.
5. Press **Save ALL & Exit Edit** to save the active edit value and commit the edited preset set.
6. Press **Discard Changes** to leave edit mode without saving the active edit value.

The active edit slot flashes with a lighter shade of its green, amber, or purple family.

## 10. Color Guide

| Color | Meaning |
|---|---|
| Green | Direct brightness editing |
| Amber | Fade target editing |
| Purple | Fade time editing |
| Dark family shade | Preset or Previous value |
| Full family shade | Rotary encoder or active editor |
| Lighter flashing shade | Active preset-edit slot |
| Pulsing green | Fade running |
| Gray | MX40 brightness feedback offline |
| Red | Brightness command error |

Offline gray and error red override the normal family colors.

## 11. Quick Troubleshooting

**Connection shows Bad Config or brightness displays `--%`**

- Enter the MX40 **Target IP** for that connection.
- Confirm the port is `8001`, unless the controller was configured differently.
- Confirm Companion and the MX40 are on reachable networks.
- Check the NovaStar COEX connection status in Companion.

**Buttons all show `Screen 1`**

- Open each `novastar-coex-N` connection.
- Set a unique **Screen Name** for each MX40.
- The button labels update from the module variable `screen_0_name`.

**The config imports, but the NovaStar module is missing**

- Confirm Companion can see this local `companion-module-novastar-coex` repo as a development module.
- The config instances reference `moduleId: novastar-coex` and `moduleVersionId: dev`.

**Brightness presets or rotaries do nothing**

- Select at least one screen's **Direct Edit** button first.
- Confirm the screen is online and showing a percentage instead of `--%`.

**Execute Fade does nothing**

- Select at least one screen's **Fade** button first.
- Exit Preset Edit if it is active.
- Confirm the screen is online and showing a percentage instead of `--%`.

**A button turns red**

- Companion received a brightness command error.
- Check the connection, then retry a brightness command. A successful command clears the error.
