import { createClient } from 'redis';

const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect(() => {
    console.log("connect success");
  });

const test = ()=>{
    client.hset
}