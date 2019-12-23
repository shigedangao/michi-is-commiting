# michi is commiting

Just a bot to run the command ```kustomize edit set image image:tag``` and commit to a repo which represent the infrastructure as code. 

## infrastructure of code repo eg

```
-- infra
--- zaoshang
----- base
----- overlays
------- preprod
------- prod
```

## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Usage

In a github pull request comment the pr with the following command

```
/michi-commit staging=<overlay name> <project name> <tag name>
```

example

```
/michi-commit staging=preprod zaoshang eb126c6
```

## Contributing

If you have suggestions for how auto-commit could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 marc <marc.intha-amnouay@luludansmarue.org>
