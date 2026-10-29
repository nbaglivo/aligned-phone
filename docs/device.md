# Device setup and gotchas

Target: **OnePlus 6 (`oneplus-enchilada`)**, postmarketOS v26.06 (systemd
variant), flashed via webflash. Developed from a Mac.

## Access

- USB networking: phone `172.16.42.1`, Mac `172.16.42.2` (interface `en5`).
- `ssh user@172.16.42.1`. Default credentials of prebuilt images are
  `user` / `147147` (changed after setup; key auth via `ssh-copy-id`).
- sshd: `doas systemctl enable --now sshd`.
- The phone needs **Wi-Fi for `apk`** — USB networking gives no internet:
  `doas nmcli device wifi connect "<SSID>" password "<pw>"`.

## Facts about this image (don't guess these)

- `doas`, not `sudo`.
- systemd, not OpenRC (`systemctl`, not `rc-service`/`rc-update`).
- Login manager is `tinydm` (`systemctl status display-manager`).

## Session setup

Installed: `cage chromium wlr-randr nodejs` (and `busybox-extras` from before
the daemon existed).

`/usr/share/wayland-sessions/calm.desktop`:

```ini
[Desktop Entry]
Name=Calm
Exec=/usr/local/bin/calm-session
Type=Application
```

Made default with:
`doas tinydm-set-session -f -s /usr/share/wayland-sessions/calm.desktop`

`/usr/local/bin/calm-session`:

```sh
#!/bin/sh
node /opt/calm-daemon/server.mjs &
exec cage -- sh -c '
  wlr-randr --output "$(wlr-randr | head -1 | cut -d" " -f1)" --scale 2.5
  exec chromium --kiosk --app=http://127.0.0.1:8080 \
    --ozone-platform=wayland \
    --no-first-run --noerrdialogs --disable-pinch
'
```

Paths on the phone: shell build → `/opt/calm/`, daemon → `/opt/calm-daemon/`.

Restart the session: `doas systemctl restart tinydm`. If it reports
"Job canceled", run `doas systemctl start tinydm`.

Back to Sxmo: `ls /usr/share/wayland-sessions/`, then `tinydm-set-session`
with the Sxmo file, then restart tinydm.

## Unattended deploys (one-time setup)

So `scripts/deploy.sh` (and coding agents) can deploy without passwords:

```sh
# on the Mac
ssh-copy-id user@172.16.42.1

# on the phone
doas chown -R user:user /opt/calm /opt/calm-daemon
echo 'permit nopass user as root cmd systemctl args restart tinydm' | doas tee -a /etc/doas.conf
echo 'permit nopass user as root cmd systemctl args start tinydm'   | doas tee -a /etc/doas.conf
doas apk add rsync   # optional, faster deploys
```

Only restarting tinydm is passwordless; everything else still asks.

## Gotchas we already hit

- **Tiny window / app uses part of the screen**: caused by Chromium's
  `--force-device-scale-factor` on Wayland. Scale the output with
  `wlr-randr --scale` inside cage instead (as above).
- **`file://` doesn't work**: Chromium blocks module scripts there. Always
  serve over HTTP.
- **macOS "No route to host" on ping/ssh** with a correct route: the terminal
  app lacks the Local Network permission (System Settings → Privacy &
  Security → Local Network).
- **`'xterm-ghostty': unknown terminal type`** on the phone: copy the
  terminfo once:
  `infocmp -x xterm-ghostty | ssh user@172.16.42.1 -- tic -x -`
  (or `export TERM=xterm-256color`).
- Battery on this device is a `bq27411`-style fuel gauge under
  `/sys/class/power_supply/`; find it by `type == Battery`, don't hardcode
  the name.
