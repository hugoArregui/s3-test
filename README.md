Reproduction steps:

create an `.env` file:

```
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   S3_BUCKET=
```

> yarn build
> node dist/script.js # execute once so the files are uploaded
> node dist/script.js # this should trigger the problem
