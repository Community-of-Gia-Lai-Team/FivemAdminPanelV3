///////////////////////////////WALLPAPER///////////////////////////////

const wallpapersNames = ["bg1", "bg2", "bg3", "bg4", "bg5"]
var currentWallpaper = 0;
const timePerWallpaper = 60;

function ChangeWallpaper(){
    currentWallpaper += 1;
    if(currentWallpaper > (wallpapersNames.length - 1)){ currentWallpaper = 0; }
    document.getElementById('kt_body').style.backgroundImage = `url(./assets/media/${wallpapersNames[currentWallpaper]}.jpg)`
}

setInterval(() => {
    ChangeWallpaper();
}, timePerWallpaper * 1000);

///////////////////////////////WALLPAPER///////////////////////////////




/////////////////////////////////WIZARD////////////////////////////////
const WizardStepsID = ["serverFramework", "databaseSettings", "rconCredentials", "ftpCredentials", "completedWizard"];
const WizardProgressID = ["serverFrameworkPrg", "databaseSettingsPrg", "rconCredentialsPrg", "ftpCredentialsPrg", "completedWizardPrg"];
var currentStep = 0;

const continueButton = document.getElementById("ContinueWizard");
document.getElementById('BackWizard').style.display = 'none';

continueButton.addEventListener("click", function() {
    switch(currentStep){
        case 0:
            SelectFramework();
            break;
        case 1:
            DatabaseSettings();
            break;
        case 2:
            RconCredentials();
            break;
        case 3:
            FTPCredentials();
            break;
        case 4:
            Finish();
            break;
            
    }
});



const backButton = document.getElementById("BackWizard");

backButton.addEventListener("click", function() {
    GoBack();
});

function GoOn(){
    if((currentStep + 1) >= WizardStepsID.length){
        console.log("finish")
        return;
    }
    document.getElementById(WizardStepsID[currentStep]).style.display = 'none';
    document.getElementById(WizardStepsID[currentStep + 1]).classList.add('animate__fadeIn');
    document.getElementById(WizardStepsID[currentStep + 1]).style.display = 'block';

    document.getElementById('BackWizard').style.display = 'block';

    document.getElementById(WizardProgressID[currentStep]).classList.remove('current');
    document.getElementById(WizardProgressID[currentStep]).classList.add('completed');
    document.getElementById(WizardProgressID[currentStep + 1]).classList.add('animate__fadeIn');

    document.getElementById(WizardProgressID[currentStep + 1]).classList.add('current');

    if((currentStep + 2) >= WizardStepsID.length){
        document.getElementById("buttonText").innerHTML = 'Finish';
        document.getElementById('arrowContinue').style.display = 'none';
    } else {
        document.getElementById("buttonText").innerHTML = 'Continue';
        document.getElementById('arrowContinue').style.display = 'block';
    }

    currentStep += 1;
}

function GoBack(){
    document.getElementById(WizardStepsID[currentStep]).style.display = 'none';
    document.getElementById(WizardStepsID[currentStep - 1]).style.display = 'block';
    if(currentStep != 1){
        if(currentStep - 1 < WizardStepsID.length){
            document.getElementById("buttonText").innerHTML = 'Continue';
        }
        document.getElementById('BackWizard').style.display = 'block';
    } else {
        document.getElementById('BackWizard').style.display = 'none';
    }

    document.getElementById(WizardProgressID[currentStep]).classList.remove('current');
    document.getElementById(WizardProgressID[currentStep]).classList.remove('completed');

    document.getElementById(WizardProgressID[currentStep - 1]).classList.remove('completed');
    document.getElementById(WizardProgressID[currentStep - 1]).classList.add('current');

    currentStep -= 1;
}

/////////////////////////////////WIZARD////////////////////////////////




///////////////////////////////FUNCTIONS//////////////////////////////

function Summary(){
    $.get("http://localhost:3000/api/setup/summary", function(data, status){
        if(data.status == 'success'){
            document.getElementById('s_framework').innerHTML = data.summary.framework.toUpperCase();

            document.getElementById('s_db').innerHTML = `<strong>HOST:</strong> ${data.summary.db_server}<br><strong>PORT:</strong> ${data.summary.db_port}<br><strong>PASSWORD:</strong>
            ${data.summary.db_password}<br><strong>NAME:</strong> ${data.summary.db_name}`;

            document.getElementById('s_rcon').innerHTML = `<strong>IP:</strong> ${data.summary.rcon_ip}<br><strong>PORT:</strong> ${data.summary.rcon_port}<br><strong>PASSWORD:</strong>
            ${data.summary.rcon_password}`;
            
            document.getElementById('s_ftp').innerHTML = `<strong>HOST:</strong> ${data.summary.ftp_server}<br><strong>PORT:</strong> ${data.summary.ftp_port}<br><strong>USERNAME:</strong>
            ${data.summary.ftp_username}<br><strong>PASSWORD:</strong>
            ${data.summary.ftp_password}`;
            return true;
        } else if(data.status == 'bad') {
            const code = data.errorCode;
            swal("¡Error!", `Error trying to get the configuration summary, ErrorCode: ${code}`, "error");
            return false;
        }
    });
}

function Finish(){
    // $.get("http://localhost:3000/api/setup/finish", function(data, status){
    //     if(data.status == 'success'){
    //         document.getElementById('panelRight').classList.add("animate__animated", "animate__backOutRight");
    //         document.getElementById('panelLeft').classList.add("animate__animated", "animate__backOutLeft");
    //         return true;
    //     } else if(data.status == 'bad') {
    //         const code = data.errorCode;
    //         swal("¡Error!", `Error trying to finish setup, ErrorCode: ${code}`, "error");
    //         return false;
    //     }
    // })
    document.getElementById('kt_body').style.overflow = 'hidden';
    document.getElementById('panelRight').classList.add("animate__animated", "animate__backOutRight");
    document.getElementById('panelLeft').classList.add("animate__animated", "animate__backOutLeft");
    setTimeout(() => {
        document.getElementById('panelRight').remove();
        document.getElementById('panelLeft').remove();
        document.getElementById('kt_create_account_stepper').classList.remove("stepper", "stepper-pills", "stepper-column", "d-flex", "flex-column", "flex-xl-row", "flex-row-fluid")
        document.getElementById('NewAccountPanel').style.display = 'block';
        document.getElementById('NewAccountPanel').classList.add("animate__animated", "animate__backInDown");
    }, 600);
}

function SelectFramework(){
    LoadingButton();
    let buttons = document.getElementsByName('framework');
    var framework = null;
    buttons.forEach(element => {
        if(element.checked){
            framework = element.value;
        }
    });
    if(framework == null){
        swal("¡Error!", `You have to select a framework to continue.`, "error");
        UnLoadingButton();
        return;
    }
    obj = { newFramework: framework}
    $.post("http://localhost:3000/api/setup/selectframework", obj, function(data, status){
        UnLoadingButton();
        if(data.status == 'success'){
            GoOn();
            return true;
        } else if(data.status == 'bad') {
            const code = data.errorCode;
            swal("¡Error!", `Error trying to connect to database, ErrorCode: ${code}`, "error");
            return false;
        }
    });
}

function DatabaseSettings(){
    LoadingButton();
    let db_host = document.getElementsByName('db_server')[0].value;
    let db_port = document.getElementsByName('db_port')[0].value;
    let db_username = document.getElementsByName('db_username')[0].value;
    let db_password = document.getElementsByName('db_password')[0].value;
    let db_name = document.getElementsByName('db_name')[0].value;
    obj = {host: db_host, user: db_username, password: db_password, name: db_name, port: db_port};
    if(db_host == "" || db_port == "" || db_username == "" || db_name == ""){
        swal("¡Error!", `Some credentials are missing.`, "error");
        UnLoadingButton();
        return;
    }
    $.post("http://localhost:3000/api/setup/checkDatabase", obj, function(data, status){
        UnLoadingButton();
        if(data.status == 'success'){
            swal("¡Success!", "Successfull connected to database", "success");
            GoOn();
            return true;
        } else if(data.status == 'bad') {
            const code = data.errorCode;
            swal("¡Error!", `Error trying to connect to database, ErrorCode: ${code}`, "error");
            return false;
        } else {
            return false;
        }
    });
}

function RconCredentials(){
    LoadingButton();
    let rcon_port = document.getElementsByName('sv_port')[0].value;
    let rcon_ip = document.getElementsByName('sv_ip')[0].value;
    let rcon_password = document.getElementsByName('sv_password')[0].value;
    obj = {host: rcon_ip, password: rcon_password, port: rcon_port};
    if(rcon_port == '' || rcon_ip == '' || rcon_password == ''){
        swal("¡Error!", `Some credentials are missing.`, "error");
        UnLoadingButton();
        return;
    }
    $.post("http://localhost:3000/api/setup/checkRcon", obj, function(data, status){
        UnLoadingButton();
        if(data.status == 'success'){
            swal("¡Success!", "Successfull connected to Server RCON", "success");
            GoOn();
            return true;
        } else if(data.status == 'bad') {
            const code = data.errorCode;
            swal("¡Error!", `Error trying to connect to RCON, ErrorCode: ${code}`, "error");
            return false;
        } else {
            return false;
        }
    });
    //GoOn();
}

function FTPCredentials(){
    LoadingButton();
    let ftp_host = document.getElementsByName('ftp_server')[0].value;
    let ftp_port = document.getElementsByName('ftp_port')[0].value;
    let ftp_password = document.getElementsByName('ftp_password')[0].value;
    let ftp_username = document.getElementsByName('ftp_username')[0].value;
    if(ftp_host == '' || ftp_port == '' || ftp_password == '' || ftp_username == ''){
        swal("¡Error!", `Some credentials are missing.`, "error");
        UnLoadingButton();
        return;
    }
    obj = {host: ftp_host, username: ftp_username, password: ftp_password, port: ftp_port};
    $.post("http://localhost:3000/api/setup/checkFtp", obj, function(data, status){
        UnLoadingButton();
        if(data.status == 'success'){
            swal("¡Success!", "Successfull connected to FTP", "success");
            Summary();
            GoOn();
            return true;
        } else if(data.status == 'bad') {
            const code = data.errorCode;
            swal("¡Error!", `Error trying to connect to FTP, ErrorCode: ${code}`, "error");
            return false;
        } else {
            return false;
        }
    });
    UnLoadingButton();
}

function LoadingButton(){
    document.getElementById('ContinueWizard').setAttribute("data-kt-indicator", "on");
    document.getElementById('arrowContinue').style.display = 'none';
    document.getElementById('ContinueWizard').setAttribute("disabled", "on");
}

function UnLoadingButton(){
    document.getElementById('ContinueWizard').removeAttribute("data-kt-indicator", "on");
    document.getElementById('arrowContinue').style.display = 'block';
    document.getElementById('ContinueWizard').removeAttribute("disabled");
}

///////////////////////////////FUNCTIONS//////////////////////////////