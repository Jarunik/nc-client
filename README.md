# nc-client

An alternative and experimental client for the blockchain game NextColony.

Demo: [nc-client.jarunik.com/](https://nc-client.jarunik.com/)

Documentation about NextColony: [jarunik.github.io/nc-docs/](https://jarunik.github.io/nc-docs/)

Official Game Client: [nextcolony.io](https://nextcolony.io)

## Contributing

Contributions to the web client are very welcome.

Please open issues for feedback, ideas, change request and bug reports.

To help with development:

1. Fork the repository
2. Create a feature branch on the `develop` branch
3. Make a pull request to the `develop` branch
4. Let jarunik know on Discord: [discord.gg/A8tH9Vv](https://discord.gg/A8tH9Vv)
5. Jarunik will review, discuss and merge the pull request.

In case you want to do bigger changes: Please describe them in an issue and discuss them with jarunik before implementation.

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Environment Variables

Please check `.env` for environment configurations.

Example:

```bash
VUE_APP_ROOT_API=https://nextcolony.io/api
VUE_APP_STEEMCONNECT_APP=nc-client
VUE_APP_JSON_ID=nextcolony
```

You can create a local file `.env.development.local` to use a different configuration during development.
This will only work if you have a server providing the needed API's.
`npm run server` will use the `.env.development` environment by default.

```bash
VUE_APP_ROOT_API=https://locahost:8080/api
VUE_APP_STEEMCONNECT_APP=nc-client
VUE_APP_JSON_ID=nextcolony.test
```

More information about Environment Variables in VueJS: [cli.vuejs.org/guide/mode-and-env.html#modes](https://cli.vuejs.org/guide/mode-and-env.html#modes)

#### VUE_APP_ROOT_API

The root of the API server that will provide the data through an API as specified here: [jarunik.github.io/nc-docs/api/](https://jarunik.github.io/nc-docs/api/)

Example call that will be created: `VUE_APP_ROOT_API + "/loaduser"`

#### VUE_APP_STEEMCONNECT_APP

This is the steemconnect app that will be used to manage the authorities. You will have to create your own to whitelist your IP.

You can find the information to create the Steemconnect App registration here: [app.steemconnect.com/apps/create](https://app.steemconnect.com/apps/create)

#### VUE_APP_JSON_ID

You have to include the correct ID in order that the backend server will pick up your JSON transactions.

You can find more information about the JSON format here: [jarunik.github.io/nc-docs/json/](https://jarunik.github.io/nc-docs/json/)

The currently productive game server uses the id: `nextcolony`.
