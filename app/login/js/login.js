const loginButton = document.getElementById("LoginButton");

loginButton.addEventListener("click", function() {
    Login();
});

function Login(){
    const username = document.getElementsByName('username')[0].value
    const password = document.getElementsByName('password')[0].value
    if(username == '' || password == ''){
        document.getElementById('errorContainer').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = 'Username or Password fields are empty, please fill both fields.';
    }
    // $.post("http://localhost:3000/api/setup/checkDatabase", obj, function(data, status){
    //     UnLoadingButton();
    //     if(data.status == 'success'){
    //         swal("¡Success!", "Successfull connected to database", "success");
    //         GoOn();
    //         return true;
    //     } else if(data.status == 'bad') {
    //         const code = data.errorCode;
    //         swal("¡Error!", `Error trying to connect to database, ErrorCode: ${code}`, "error");
    //         return false;
    //     } else {
    //         return false;
    //     }
    // });
}