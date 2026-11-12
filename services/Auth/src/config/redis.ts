import { createClient } from "redis"

const apiURL  = process.env.NODE_ENV == "production" 
            ? process.env.REDIS_URI 
            : "redis://localhost:6379"
               

const redisClient = createClient( { url: apiURL as string} )

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", console.error);


await redisClient.connect()



export default redisClient