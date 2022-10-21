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
    if((currentStep + 1) >= WizardStepsID.length){
        FinishSetup();
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
        document.getElementById("ContinueWizard").innerHTML = 'Finish';
    } else {
        document.getElementById("ContinueWizard").innerHTML = 'Continue';
    }

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
    }

    currentStep += 1;
});



const backButton = document.getElementById("BackWizard");

backButton.addEventListener("click", function() {
    document.getElementById(WizardStepsID[currentStep]).style.display = 'none';
    document.getElementById(WizardStepsID[currentStep - 1]).style.display = 'block';
    if(currentStep != 1){
        if(currentStep - 1 < WizardStepsID.length){
            document.getElementById("ContinueWizard").innerHTML = 'Continue';
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
});

/////////////////////////////////WIZARD////////////////////////////////




///////////////////////////////FUNCTIONS//////////////////////////////

function FinishSetup(){
    
}

function SelectFramework(){
    
}

function DatabaseSettings(){
    
}

function RconCredentials(){
    
}

function FTPCredentials(){
    
}

///////////////////////////////FUNCTIONS//////////////////////////////