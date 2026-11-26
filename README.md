# Knots Made Easy

See how knots are tied, step by step, with a physically simulated rope.

Original project demo: **[knots-made-easy.pages.dev](https://knots-made-easy.pages.dev)**. Run this checkout to open the expanded library.

## Original gallery

<table>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/overhand/"><img src="public/og/overhand.jpg" width="260" alt="Overhand knot"><br>Overhand knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/slip-knot/"><img src="public/og/slip-knot.jpg" width="260" alt="Slip knot"><br>Slip knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/figure-eight/"><img src="public/og/figure-eight.jpg" width="260" alt="Figure-eight knot"><br>Figure-eight knot</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/bowline/"><img src="public/og/bowline.jpg" width="260" alt="Bowline"><br>Bowline</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/clove-hitch/"><img src="public/og/clove-hitch.jpg" width="260" alt="Clove hitch"><br>Clove hitch</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/zeppelin/"><img src="public/og/zeppelin.jpg" width="260" alt="Zeppelin bend"><br>Zeppelin bend</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/square-knot/"><img src="public/og/square-knot.jpg" width="260" alt="Square knot"><br>Square knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/poachers-knot/"><img src="public/og/poachers-knot.jpg" width="260" alt="Poacher's knot"><br>Poacher's knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/daisy-chain/"><img src="public/og/daisy-chain.jpg" width="260" alt="Daisy chain"><br>Daisy chain</a></td>
  </tr>
</table>

The expanded catalog has **29 animated lessons**. Open **20 essentials** in the knot library to see a cross-section of household, camping, boating and fishing knots. The collection draws on the [Scouting America basic knots](https://troopleader.scouting.org/rank-advancement-skills/campcraft/basic-knots/) and [Animated Knots essential knots](https://www.animatedknots.com/essential-knots) lists. Its order is for browsing rather than a measured usage ranking.

| Job                   | Knots in the Essentials collection                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Stop a rope slipping  | Overhand, slip knot, figure eight, double overhand stopper                                             |
| Make a fixed loop     | Bowline, figure-eight follow-through                                                                   |
| Bind or join          | Square knot, sheet bend, fisherman’s knot, double fisherman’s bend                                     |
| Tie to a support      | Clove hitch, lark’s head, two half hitches, round turn and two half hitches, timber hitch, cleat hitch |
| Adjust tension        | Taut-line hitch, rolling hitch, trucker’s hitch                                                        |
| Attach fishing tackle | Improved clinch knot                                                                                   |

The full catalog also includes the Zeppelin bend, poacher’s knot, daisy chain, half hitch, constrictor knot, overhand loop, double sheet bend, anchor hitch and figure-eight bend. Search by name, alternate name or use. Search and filters are saved in the address, so you can return to a selection or share it.

## The stargazer rope

Every GitHub star ties a knot. Star the repo and your face joins the rope.

[![The stargazer rope](.github/stargazer-rope-5fb313cb.svg)](https://knots-made-easy.pages.dev/#stargazers)

## Run it

Needs Node 22.22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Run `pnpm build` for the static site in `build/client`. The build prepares a compressed 60-frame-per-second motion file for each lesson. Leave the `motion/` directory with the other built files when serving or copying the site. Opening a knot loads only its motion file. Custom rope settings run the simulation in a worker and start playing when all frames are ready.

Set `VITE_SITE_URL` to your deployment origin before building to set its canonical and share-preview URLs.

React, React Router and three.js, no physics library. [AGENTS.md](AGENTS.md) explains how it fits
together and how to add a knot.

## License

[MIT](LICENSE)
