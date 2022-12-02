# Postgres Migrations

Migrations are managed with [ley](https://www.npmjs.com/package/ley)

## Create New Migrations

```
npm run migrate new <short_migration_description>.ts
```

## Apply Migrations

```
npm run migrate up
```

Before running migrations, make sure to configure 