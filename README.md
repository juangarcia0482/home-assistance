# Home Assistant Configuration

Version: 2021.5

Operating System: 5.13

[Hass.io](https://home-assistant.io/) installed on a [Raspberry Pi 3 Model B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) and running on a wall mounted tablet (lenovo M10) displaying Home Assistant [Fully Kiosk Browser](https://www.fully-kiosk.com/) (chrome).

## 🚀 Installation

> **✨ Simple 3-step process: Add repo → Install cards → Copy files → Done!**

### **Method 1: HACS Installation (Recommended)**

#### **Prerequisites**
- ✅ Home Assistant Core 2021.5+ installed
- ✅ [HACS (Home Assistant Community Store)](https://hacs.xyz/) installed and configured

#### **Step 1: Add Repository to HACS**
1. **Go to HACS** in your Home Assistant
2. **Click on "Integrations"**
3. **Click the three dots** (⋮) in the top right corner
4. **Select "Custom repositories"**
5. **Add this repository:**
   - Repository: `https://github.com/juangarcia0482/home-assistance`
   - Category: `Integration`
   - Click "Add"
6. **Download the configuration:**
   - Search for "Home Assistant Configuration - LAJV"
   - Click "Download this repository with HACS"

#### **Step 2: Install Required Frontend Cards**
7. **Go to HACS → Frontend** (different section!)
8. **Install each card** listed in "Required Frontend Components" below

#### **Step 3: Copy Essential Files**
9. **Copy essential files** using the commands in the section below

### **Method 2: Direct Download (Alternative)**
1. **[Download ZIP](https://github.com/juangarcia0482/home-assistance/archive/refs/heads/main.zip)** from this repository
2. **Extract** and **copy essential files** to your Home Assistant main config folder

---

## 🔧 Required Frontend Components
**Install these separately through HACS → Frontend** (not custom repositories):

> **📍 How to find HACS → Frontend:**
> 1. Open **Home Assistant** sidebar
> 2. Click **HACS** (should be in your sidebar)
> 3. You'll see the main HACS page with search and filters
> 4. In the **Type** filter, click **Dashboard** (this is the Frontend section!)
> 5. Search for each card by name and install
>
> **Note**: "Dashboard" = Frontend cards in HACS interface

1. **Button Card** by `@RomRider` 
   - Filter Type: **Dashboard**, Search: "button-card" (with hyphen)
   - [GitHub](https://github.com/custom-cards/button-card)

2. **Card Mod** by `@thomasloven`
   - Filter Type: **Dashboard**, Search: "card-mod" (with hyphen)
   - [GitHub](https://github.com/thomasloven/lovelace-card-mod)

3. **Config Template Card** by `@iantrich`
   - Filter Type: **Dashboard**, Search: "config-template-card" (with hyphens)
   - [GitHub](https://github.com/iantrich/config-template-card)

4. **Bar Card** - Filter Type: **Dashboard**, Search: "bar-card" (with hyphen)
   - **If not found, add as custom repository:**
   - Go to HACS → Three dots (⋮) → Custom repositories
   - Repository: `https://github.com/custom-cards/bar-card`
   - Category: `Lovelace`
   - Then search for "Bar Card" in Dashboard
   - [GitHub](https://github.com/custom-cards/bar-card)

5. **Mini Graph Card** - Filter Type: **Dashboard**, Search: "mini-graph-card" (with hyphens)
   - [GitHub](https://github.com/kalkih/mini-graph-card)

6. **Mini Media Player** - Filter Type: **Dashboard**, Search: "mini-media-player" (with hyphens)
   - [GitHub](https://github.com/kalkih/mini-media-player)

## ✨ Essential Files to Copy

After downloading via HACS or ZIP, you need to copy these **essential files**:

```
📁 From HACS download location (www/community/home-assistance/) or ZIP
│
├── 📄 ui-lovelace.yaml          → Copy to /homeassistant/
├── 📄 ui-lovelace_mobile.yaml  → Copy to /homeassistant/
├── 📄 configuration.yaml       → Merge with your existing /homeassistant/configuration.yaml  
├── 📄 button_card_templates.yaml → Copy to /homeassistant/
├── 📄 groups.yaml              → Copy to /homeassistant/
├── 📄 automations.yaml         → Copy to /homeassistant/
├── 📄 scripts.yaml             → Copy to /homeassistant/
├── 📄 scenes.yaml              → Copy to /homeassistant/
├── 📄 customize.yaml           → Copy to /homeassistant/
├── 📄 themes.yaml              → Copy to /homeassistant/
├── 📄 homekit.yaml             → Copy to /homeassistant/
├── 📄 deployment/templates/secrets_template.yaml → Copy as secrets.yaml to /homeassistant/
└── 📁 www/                     → Merge contents into your existing /homeassistant/www/
    ├── js/                     → Copy to /homeassistant/www/js/
    ├── people/                 → Copy to /homeassistant/www/people/
    ├── robot/                  → Copy to /homeassistant/www/robot/
    ├── ui/                     → Copy to /homeassistant/www/ui/
    ├── upcoming-media-card-images/ → Copy to /homeassistant/www/upcoming-media-card-images/
    └── transparent.png         → Copy to /homeassistant/www/transparent.png
```

### **🔄 Quick Copy Commands**

**Option A: Batch Copy (Recommended)**
Run this single command in your Home Assistant SSH terminal:
```bash
# Copy all essential files at once
cp -r www/community/home-assistance/www/{js,people,robot,ui,upcoming-media-card-images} www/ && \
cp www/community/home-assistance/www/transparent.png www/ && \
cp www/community/home-assistance/{ui-lovelace.yaml,ui-lovelace_mobile.yaml,button_card_templates.yaml,groups.yaml,automations.yaml,scripts.yaml,scenes.yaml,customize.yaml,themes.yaml,homekit.yaml} /homeassistant/ && \
cp www/community/home-assistance/deployment/templates/secrets_template.yaml /homeassistant/secrets.yaml
```

**Option B: Individual Commands**
If batch fails, run these commands **one by one**:
```bash
# Clean up any previous failed attempts
rm -rf www/www

# Copy www folders
cp -r www/community/home-assistance/www/js www/
cp -r www/community/home-assistance/www/people www/
cp -r www/community/home-assistance/www/robot www/
cp -r www/community/home-assistance/www/ui www/
cp -r www/community/home-assistance/www/upcoming-media-card-images www/

# Copy www files
cp www/community/home-assistance/www/transparent.png www/

# Copy configuration files
cp www/community/home-assistance/ui-lovelace.yaml /homeassistant/
cp www/community/home-assistance/ui-lovelace_mobile.yaml /homeassistant/
cp www/community/home-assistance/button_card_templates.yaml /homeassistant/
cp www/community/home-assistance/groups.yaml /homeassistant/
cp www/community/home-assistance/automations.yaml /homeassistant/
cp www/community/home-assistance/scripts.yaml /homeassistant/
cp www/community/home-assistance/scenes.yaml /homeassistant/
cp www/community/home-assistance/customize.yaml /homeassistant/
cp www/community/home-assistance/themes.yaml /homeassistant/
cp www/community/home-assistance/homekit.yaml /homeassistant/
cp www/community/home-assistance/deployment/templates/secrets_template.yaml /homeassistant/secrets.yaml
```

> ⚠️ **Important**: 
> - Run these commands in **Home Assistant SSH terminal**, not local PowerShell
> - Make sure you're in the `/homeassistant/` directory before running
> - **Backup your existing configuration files first** if you have important customizations

## ⚠️ **Important Configuration Steps**

> **Note**: Your main config folder might be `/config/` or `/homeassistant/` depending on your installation

After installation, you **must** customize these:

1. **Copy essential files** from `www/community/home-assistance/` to your main config folder (see commands above)
2. **Install frontend cards** - Go to HACS → Frontend and install the 6 cards listed above  
3. **Set up integrations via UI** (Settings → Devices & Services):
   - **Philips Hue** - Add integration, it will auto-discover your bridge
   - **Spotify** - Add integration if you use Spotify features
   - **Buienradar** - Add integration for Dutch weather and rain forecasts
   - **Radarr** - Add integration for movie management (if using Radarr server)
   - **MQTT** - Add integration if you have an MQTT broker
   - **Xiaomi Miio** - Add integration for vacuum control
4. **Edit `secrets.yaml`** with your real credentials  
5. **Update IP addresses** in `configuration.yaml`
6. **Replace light entity names** with your actual entities

> ⚠️ **Important**: This configuration requires customization for your specific setup. The original config has specific light entities and IP addresses that need to be replaced with your own.

[Video of Full UI](https://www.youtube.com/watch?v=KcfZc1MXP_A)

![lajv-ha-lights.gif](https://github.com/lukevink/hass-config-lajv/blob/master/previews/lajv-ha-lights.gif?raw=true)
![lajv-ha-other.gif](https://github.com/lukevink/hass-config-lajv/blob/master/previews/lajv-ha-other.gif?raw=true)

## Features

* Dynamic 3D Floorplan: Hue and Brightness mapped individual lights with custom popup controller.
* Dynamic floorplan view, adjusts brightness based on calculated brightness of the sun
* Less cluttered interface displaying [more information](https://github.com/thomasloven/hass-browser_mod#popup) on a [long press](https://www.home-assistant.io/lovelace/picture-elements/#hold_action), inspired by [Mattias Persson](https://github.com/matt8707/hass-config).
* Custom rain card to display predicted rain in the next 2 hours - [seperate repo here](https://github.com/lukevink/home-assistant-buienradar-forecast-card)
* Custom Xiaomi View for rapid room based zone cleanup


## Approach & Picture-Elements Styling

This approach is heavily based on the [Picture Elements Card](https://www.home-assistant.io/lovelace/picture-elements/) for each view, and does not work in a traditional "Card" based way. Most cards include a heavy amount of styling and positioning. Some of this styling overrides the custom cards to use [View Width](https://css-tricks.com/fun-viewport-units/) so that their fonts, widths and heights scale according to the width of the display, so that I can use my interface on any resolution.

I first designed my whole UI in [Pixelmator](https://www.pixelmator.com/) so that I could export the button images and Xiaomi floorplan overlay images.

The image transparent.png is used on state_image picture-elements to hide elements if not needed, though this was used before I realised I could conditionally display elements :) - will update this soon to clean it up.



## Beginners warning

This config is not the simplest config to copy and paste. If you try to run my exact config you will have issues until you replace all mentions of my light instances (and other entities) with your own. The floorplan views for example, relies on custom-config-template.js which will throw errors if you try to access light entities that aren't in your system. I recommend at least replacing all light entities with some of your own to start with, then customizing the view for each of your own.

Knowing a bit of CSS will help here too. Because the config is picture-elements based, each card is styled heavily with CSS. If something doesnt appear right, its probably to do with CSS. Note: Only the floorplan view is designed to scale with resolution, other views may look funky on different sized screens.


## The sidebar

Note, the sidebar is repeated across every view in the lovelace.yaml file and includes buttons for the views.

* Control Rooms: Tap a room to turn on or off all lights, hold tap to show custom controls.
* Control Lights: Tap a light icon to turn on or off individual lights, hold tap to show custom controls.
* Cleanup: Direct control of Xiaomi Mi robot and preset zones for room based cleanup
* All Devices: Show all devices in a familiar homekit UI, why not?
* Media: Button shows currently playing media, if playing, view shows relevant views for Plex or Spotify.
* Weather: Shows weather forecast and predicted rain from Buienradar.



## Hardware in my Home

* Xgimi H1 PROJECTOR
* Sound system (controlled by an IR Blaster)
* Philips Hue Bulbs
* Osram Garden Poles (used for roof, outdoors)
* Xiaomi Mi Robot
* Philips motion sensors



## Individual hue & brightness lights

![mapped-lights-info1.png](https://github.com/lukevink/hass-config-lajv/blob/master/previews/mapped-lights-info1.png?raw=true)


**Config Template Card:**

This approach relies on config-template-card. The picture elements card is wrapped inside a config-template-card. All entites used are listed on the config card so that they can be passed to the templates used in CSS. To understand why, check: https://github.com/iantrich/config-template-card

**Individual Lights:**

To have multiple lights overlayed on top of each other, the solution is actually pretty simple. You render an image for each individual light and use the CSS property filter mix-blend-mode: lighten. This will make sure only the “light” part of the image is shown, and will blend together any amount of images on top.

**Hue and Opacity:**

To map one of your light images to the actual live RGB color of the bulb, you can use the following CSS template style which will adjust the hue rotation to the hue of the bulb (in this case, light.table):
```yaml
style:
  filter: '${ "hue-rotate(" + (states[''light.table''].attributes.hs_color ? states[''light.table''].attributes.hs_color[0] : 0) + "deg)"}'
```
OR, include saturation (I found it buggy):

```yaml
style:
  filter: '${ "hue-rotate(" + (states[''light.table''].attributes.hs_color ? states[''light.table''].attributes.hs_color[0] : 0) + "deg) saturate(" + (states[''light.table''].attributes.hs_color ? states[''light.table''].attributes.hs_color[1] : 100)+ "%)"}'
```

To map opacity to the entity’s brightness, use this css template:

```yaml
style:
  opacity: '${ states[''light.table''].attributes.brightness / 255 }'
```

## Cleanup

This is a custom screen made up of picture-elements that interact with the [xiaomi robot vacuum component](https://www.home-assistant.io/integrations/vacuum.xiaomi_miio/). An input text is used to determine the vacuums current state (cleaning, returning home etc) and that is used to conditionally change the picture-elements.

![screen-cleanup.png](https://github.com/lukevink/hass-config-lajv/blob/master/previews/screen-cleanup.png?raw=true)


## Weather

I built a custom card to display projected rain in the next 2 hours, using Buien Radar (Netherlands service).
For more on this card, check out [this repo](https://github.com/lukevink/home-assistant-buienradar-forecast-card)

![screen-weather-rain.png](https://github.com/lukevink/hass-config-lajv/blob/master/previews/screen-weather-rain.png?raw=true)
