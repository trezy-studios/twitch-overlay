# Trezy's Stream Overlay
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This is the repo for [@TrezyCodes][Twitch: TrezyCodes] stream overlay!

## Getting started

Follow these steps to run the overlay locally:

1. Install the project's dependencies:
  ```yarn install```
1. Link the Now project:
  ```now --confirm```
1. Copy the `.env.example` file to create two new files: `.env` and `.env.build`
1. Setup your local dev `ENV` variables in your `.env` and `.env.build` files (for help, see ["Getting your `ENV` variables"][#] below)

Once you've set up the local repo, you can use `yarn start` to start the local server whenever you're ready for development! The overlay will be available at [http://localhost:3000](http://localhost:3000).

### Getting your `ENV` variables

The overlay connects to several different external services for the information it provides. Below you'll find instructions on how to set up your own development environment within those services, as well as how to get the appropriate information for your `ENV` variables.

#### Tiltify

1. To start, you'll need to create an account on [Tiltify][Tiltify] if you don't already have one
1. Go to `Account-> Apps -> New Application` (or click [here][Create a Tiltify App])
    1. *Name:* Feel free to call it whatever you please
    1. *Redirect URLs:* Use any URL you want, it's not going to matter
1. Find your new application in the list and click `View Credentials`
1. Copy your `Access Token`
1. Add your access token to both of your `.env` files as `TILTIFY_ACCESS_TOKEN`

#### Twitch

Twitch is, surprisingly, the easiest one to set up. To get a Twitch access token, go to [https://twitchapps.com/tmi/][Twitch: Get an access token] and click `Connect`. Once you've logged into Twitch and authorized the app to access your account, you can copy the new access token into both of your `.env` files.





[Tiltify]: https://tiltify.com "Tiltify"
[Tiltify: Create a new app]: https://tiltify.com/@me/dashboard/account/apps/create "Tiltify: Create a new application"

[Twitch: Get an access token]: https://twitchapps.com/tmi/
[Twitch: TrezyCodes]: https://twitch.tv/TrezyCodes "TrezyCodes on Twitch"






## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://trezy.com"><img src="https://avatars2.githubusercontent.com/u/442980?v=4" width="100px;" alt=""/><br /><sub><b>Trezy</b></sub></a><br /><a href="https://github.com/trezy-studios/twitch-overlay/commits?author=trezy" title="Code">💻</a> <a href="https://github.com/trezy-studios/twitch-overlay/commits?author=trezy" title="Documentation">📖</a> <a href="#design-trezy" title="Design">🎨</a> <a href="#ideas-trezy" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-trezy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-trezy" title="Maintenance">🚧</a> <a href="#projectManagement-trezy" title="Project Management">📆</a> <a href="#question-trezy" title="Answering Questions">💬</a> <a href="https://github.com/trezy-studios/twitch-overlay/pulls?q=is%3Apr+reviewed-by%3Atrezy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/IanSSenne"><img src="https://avatars2.githubusercontent.com/u/48780301?v=4" width="100px;" alt=""/><br /><sub><b>IanSSenne</b></sub></a><br /><a href="https://github.com/trezy-studios/twitch-overlay/commits?author=IanSSenne" title="Code">💻</a> <a href="#ideas-IanSSenne" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
