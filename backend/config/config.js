module.exports = {
  database: {
    dbName: 'nikitatask',
    development: {
      db: 'mongodb://localhost:27017/nikitatask',
    }
  },
  JWT: {
    JWT_SECRET: "nikitatask",
    JWT_SECRET_ADMIN: "nikitatask-admin",
    JWT_SECRET_VALIDITY: "120 days",
    JWT_SECRET_VALIDITY_ADMIN: "120 days"
  }
}