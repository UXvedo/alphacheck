// Data adapter. Default: static on-chain snapshot (public/snapshot.json, refresh with `npm run snapshot`).
// To plug in Taostats later: set VITE_TAOSTATS_KEY and map their subnet/pool response to the same shape:
// {asOf, source, subnets:[{netuid,name,taoIn,alphaIn,alphaOut,alphaEmissionPerBlock,rootProp}]}
// NOTE: never ship a secret key in a static site; proxy it via a serverless function instead.
export async function loadData(){
  const key=import.meta.env.VITE_TAOSTATS_KEY;
  if(key){/* TODO: fetch('https://api.taostats.io/api/dtao/pool/latest/v1',{headers:{Authorization:key}}) and map */}
  return (await fetch('/snapshot.json')).json();
}
