import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  console.log('ta mere');
  // app.on('issues.opened', async (context) => {
  //   const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //   await context.github.issues.createComment(issueComment)
  // })

  // app.on('pull_request', async (context) => {
  //   console.log('loool');
  //   console.log(context);

  //   return Promise.resolve();
  // })

  // app.on('pull_request.labeled', async (context) => {
  //   console.log('loool');
  //   console.log('allez merde');

  //   return Promise.resolve();
  // });

  app.on("*", async (context) => {
    console.log('hey')
    console.log(context.event)
    console.log(context.payload.comment.body)

    return Promise.resolve();
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
