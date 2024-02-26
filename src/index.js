const {setKeyValue,getKeyValue} = require('./redis')
const main = async()=>{
    try {
        const key = 'hype'
        const value = 'hypeMan'
        await setKeyValue(key,value)
        const cacheValue = await getKeyValue('hype')
        console.log('Value recived from cache',cacheValue)
        console.log('Are both value equal',cacheValue === value)
    } catch (error) {
        console.log(error)
    }
}

main()