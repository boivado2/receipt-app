import winston from "winston"


export default () => {
  if(!process.env.jsonWebToken) {
    winston.log('error',"jwt token key not defined")
    console.log("jwt token not defined")
    process.exit(1)
  }
}