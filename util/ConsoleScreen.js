exports.StartupScreen = function (info){
    console.log('\n')
    console.log("\t    - - = = xtacy = = - -    ")
    console.log("\t-----------------------------")
    console.log("\tSERVER =============== SERVER")
    console.log("\t-----------------------------")
    console.log('\n')

    if(info.ServerState==="NORMAL"){
    console.log(`\t    [STARTING] : PORT ${info.PORT}   `)
    } else if(info.ServerState==="MAINT") {
        console.log("\t[UNABLE TO START] SORRY, This server is under maintainence!")
        console.log("\n- - - = = = [PROCESS TERMINATED] = = = - - -\n")
    }
    
    console.log('\n')
}