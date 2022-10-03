var adb = require('adbkit')
var assert = require('assert');
var nodeConsole = require('console');
const electron = require('electron')
var Promise = require('bluebird')
let os = require('os')
const { exec } = require("child_process");

const remote = electron.remote
var console1 = new nodeConsole.Console(process.stdout, process.stderr);
var client = adb.createClient()


var modelo =  ""
var serial =  ""
var produto = ""
var build =   ""
var status =  ""
var conexao = "Nenhuma Conexão!"
var fast = false
var has_connection = false;

function reset_vars(){
	modelo = ""
	serial = ""
	produto = ""
	build = ""
	status = ""
	conexao = "Nenhuma Conexão!"
	change_all()
}

function fleshBoot(device,path){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	exec(__dirname+'\\adb\\fastboot.exe flash boot "'+path+'"', (error, stdout, stderr) => {
		if (error) {
			log("error",`error: ${error.message}`);
			return;
		}
		if (stderr) {
			log("sucess",`stderr: ${stderr}`);
			return;
		}
		log("???",`stdout: ${stdout}`);
	});
}

function initBoot(device,path){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	exec(__dirname+'\\adb\\fastboot.exe boot "'+path+'"', (error, stdout, stderr) => {
		if (error) {
			log("error",`error: ${error.message}`);
			return;
		}
		if (stderr) {
			log("sucess",`stderr: ${stderr}`);
			return;
		}
		log("???",`stdout: ${stdout}`);
	});
}

function check_fastboot_loop(){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	exec(__dirname+"\\adb\\fastboot.exe devices",(error, stdout, stderr) => {

		if(stdout){
			serial = stdout.split("\t")[0]
			status = "fastboot"
			conexao = stdout.split("\t")[0]
			change_all()
			if(!fast){
				log("sucess"," bootloader connected sucess!")
			}
			fast = true
		}else{
			if(fast == true){
				reset_vars()
				log("error"," Unloaded bootloader")
				fast = false
				return
			}
			//log("error"," not detected bootloader")
			fast = false
		}
	});
}


function linkexecutar(device,link){

	client.shell(device, 'am start -a android.intent.action.VIEW -d "'+link+'"').then(adb.util.readAll).then(function(output) {
		//console1.log(output)
	})
	.then(function() {
		log('sucess','Link: '+link+' open sucess!')
	})
	.catch(function(err) {
		log('error','Error to open link')
	})
}
function rebootfast(devices){
	var g = __dirname+""
	log("error",`dd: ${g}`);
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	if(fast){
		exec(__dirname+"\\adb\\fastboot.exe reboot",(error, stdout, stderr) => {
		});
	}else{
		client.shell(devices, 'reboot fastboot').then(adb.util.readAll).then(function(output) {
			log("sucess",output)
		})
		.then(function() {
			log('sucess','Reboot to fastboot sucess!')
		})
		.catch(function(err) {
			log('error','Error to Reboot to fastboot')
		})
	}
}
function rebootboot(device){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	if(fast){
		exec(__dirname+"\\adb\\fastboot.exe reboot",(error, stdout, stderr) => {
		});
	}else{client.shell(device, 'reboot bootloader').then(adb.util.readAll).then(function(output) {
		})
		.then(function() {
			log('sucess','Reboot to bootloader sucess!')
		})
		.catch(function(err) {
			log('error','Error to Reboot to bootloader')
		})
	}
}
function rebootreco(device){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	if(fast){
		exec(__dirname+"\\adb\\fastboot.exe reboot",(error, stdout, stderr) => {
		});
	}else{
		client.shell(device, 'reboot recovery').then(adb.util.readAll).then(function(output) {
		})
		.then(function() {
			log('sucess','Reboot to recovery sucess!')
		})
		.catch(function(err) {
			log('error','Error to Reboot to recovery')
		})
	}	
}

function remove_users(device){
	for (var a = 0; a < 20; a++) {
		client.shell(device, 'pm remove-user '+a).then(adb.util.readAll).then(function(output) {
			log("sucess",output.toString())
		})
		.then(function() {
			log('sucess',' User id: '+a+' removed sucess!')
		})
		.catch(function(err) {
			log('error',' Error in removing user: '+a)
		})
	}
}
function get_users(device){
	client.shell(device, 'pm list users').then(adb.util.readAll).then(function(output) {
		log("sucess",output.toString())
	})
	.then(function() {
		log('sucess',' Users find sucess!')
	})
	.catch(function(err) {
		log('error','Error in find users')
	})
}

function clear_0(device){
	client.shell(device, 'pm list packages | sed -e "s/package\://" | xargs -n1 pm clear').then(adb.util.readAll).then(function(output) {
	})
	.then(function() {
		log('sucess',' Clear sucess!')
	})
	.catch(function(err) {
		log('error','Error in clearning')
	})
}

function frp1(device){
	client.shell(device, 'am start -n com.google.android.gsf.login/').then(adb.util.readAll).then(function(output) {
	})
	.then(function() {
		log('sucess',' FRP Sucess! reset you android and register new user!!')
	})
	.catch(function(err) {
		log('error','error frp (3)')
		//frp2(device)
	})
}

function frp0(device){
	client.shell(device, 'am start -n com.google.android.gsf.login.LoginActivity').then(adb.util.readAll).then(function(output) {
	})
	.then(function() {
		log('sucess',' FRP Sucess! reset you android and register new user!!')
	})
	.catch(function(err) {
		log('error','Error frp (2)')
		frp1(device)
	})
}

function frp(device){
	client.shell(device, 'content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1').then(adb.util.readAll).then(function(output) {
	})
	.then(function() {
		log('sucess',' FRP Sucess! reset you android and register new user!!')
	})
	.catch(function(err) {
		log('error','Error frp (1)')
		frp0(device)
	})
}


function contatos(device){
	client.shell(device, 'content query --uri content://contacts/phones/  --projection name:number').then(adb.util.readAll).then(function(output) {
		var g = output.toString()
		var c = g.split(/\r?\n/);
		for (var a in c) {
			var f = c[a]
			var match = f.match(/name=.*?,/)
			var user = match[0]
			user = match[0].toString().replace("name=","").replace(",","")
			var match2 = f.match(/number.*/)
			var numero = match2[0].toString().replace("number=","").replace(",","")
			log("found","Nome: "+user+"  Numero: "+numero)
		}


	})
	.then(function() {
		log('sucess','all contact extracted sucess!')
	})
	.catch(function(err) {
		if(err.toString() == "TypeError: Cannot read property '0' of null"){
			log('sucess','All contact extracted sucess!')
		}else{
			log('error','Error on extrater contact!')
		}
	})
}

function dark(device,a){
	client.shell(device, 'settings put secure ui_night_mode '+a).then(adb.util.readAll).then(function(output) {
		console1.log(output.toString())
		reboot(device)
	})
	.then(function() {
		log('sucess','DarkMode set sucess!')
	})
	.catch(function(err) {
		log('error','DarkMode error to set!')
	})
}

function reboot(device){
	var g = __dirname+""
	var a = g.split("\\")
	a = a[a.length-1]
	__dirname = __dirname.replace(a,"")
	if(fast){
		exec(__dirname+"\\adb\\fastboot.exe reboot",(error, stdout, stderr) => {
		});
	}else{
		client.shell(device, 'reboot').then(adb.util.readAll).then(function(output) {
			//console1.log(output)
		})
		.then(function() {
			log('sucess','Reboot Sucess!')
		})
		.catch(function(err) {
			log('error','Reboot error!')
		})
	}
}

function get_serial(device){
	serial = device
	change_all()
}

function get_status(device){
	status = device
	change_all()
}
function get_model(device){
	var g = ""
	client.shell(device.id, 'getprop ro.boot.hardware.sku').then(adb.util.readAll).then(function(output) {
		g = output.toString()
	})
	.then(function() {
		modelo = g
		conexao = g
		log('sucess','Model found sucess!')
		change_all()
	})
	.catch(function(err) {
		modelo = "error"
		log('error','Model not found')
	})
}

function get_product(device){
	var g = ""
	client.shell(device.id, 'getprop ro.vendor.product.display').then(adb.util.readAll).then(function(output) {
		g = output.toString()
	})
	.then(function() {
		produto = g
		log('sucess','Product found sucess!')
		change_all()
	})
	.catch(function(err) {
		produto = "error"
		log('error','product not found!')
	})
}

function get_build(device){
	var g = ""
	client.shell(device.id, 'getprop ro.build.id').then(adb.util.readAll).then(function(output) {
		g = output.toString()
	})
	.then(function() {
		build = g
		log('sucess','Build found sucess!')
		change_all()
	})
	.catch(function(err) {
		build = "error"
		log('error','build not found!')
	})
}


function replaceText (selector, text){
	const element = document.getElementById(selector)
	element.innerText = text
}

function change_all(){
	replaceText("modelo",modelo)
	replaceText("serial",serial)
	replaceText("produto",produto)
	replaceText("build",build)
	replaceText("status",status)

	//port-usb
	var a = document.getElementById ("port-usb");
	a.placeholder = conexao;
}



function show(shown, hidden) {
	document.getElementById(shown).style.display='block';
	document.getElementById(hidden).style.display='none';
	document.getElementById(shown+"1").style.display='block';
	document.getElementById(hidden+"1").style.display='none';
	return false;
}

function log(type,msg){
	var app = '<div>['+type+']: '+msg+'</div>'
	document.getElementById('log').innerHTML += app
}

window.addEventListener('DOMContentLoaded', () => {
	const zeroFill = n => {
		return ('0' + n).slice(-2);
	}

	const interval = setInterval(() => {
		const now = new Date();
		document.getElementById('hours').placeholder = zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());
		document.getElementById('day').placeholder = zeroFill(now.getUTCDate()) + '/' + zeroFill((now.getMonth() + 1)) + '/' + now.getFullYear()
		document.getElementById('user').placeholder = os.userInfo().username
	}, 1);

	const interval2 = setInterval(() => {
		check_fastboot_loop()
	}, 3000);



	document.getElementById("mini-btn").addEventListener("click", function() {
		var window = remote.getCurrentWindow();
		window.minimize();

	});

	document.getElementById("close-btn").addEventListener("click", function() {
		var window = remote.getCurrentWindow();
		window.close();
	});

	client.trackDevices().then(function(tracker) {
		tracker.on('add', function(device) {
			if(fast){
				fast = false;
				reset_vars;
			}
			console1.log('Device %s was plugged in', device.id)
			get_model(device)
			get_serial(device.id)
			get_product(device)
			get_build(device)
			get_status(device['type'])
			log('sucess','New device detected...: '+device.type)
			conexao = device.type;
		})
		tracker.on('remove', function(device) {
			if(fast){
				fast = false;
				reset_vars;
			}
			reset_vars()
			log('sucess','Device removed...: '+JSON.stringify(device).toString())
		})
		tracker.on('change',function(device){
			if(fast){
				fast = false;
				reset_vars;
			}
			get_model(device)
			get_serial(device.id)
			get_product(device)
			get_build(device)
			get_status(device['type'])
			log('sucess','Device changed...: '+device.type)
		})
	}).catch(function(err) {
		log('error','error detected! not found ADB, please install or send in PATH')
		//console.error('Something went wrong:', err.stack)
	})



	document.getElementById("reboot-norm").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn","rebooting: "+device)
		reboot(device)
	});

	document.getElementById("reboot-reco").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn",'rebooting to recovery...:'+device)
		rebootreco(device)
	});

	document.getElementById("reboot-boot").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn",'rebooting to bootloader...:'+device)
		rebootboot(device)
	});

	document.getElementById("reboot-fast").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn",'rebooting to fastboot...:'+device)
		rebootfast(device)
	});

	document.getElementById("button-open").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		var link = document.getElementById("link_id").value;
		log("warn"," opping link: "+link)
		linkexecutar(device,link)
	});

	document.getElementById("dark-mod").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn"," changing dark theme...")
		dark(device,"2")
	});

	document.getElementById("dark-mod2").addEventListener("click", function() {
		var device = document.getElementById("serial").innerText;
		log("warn"," changing dark theme...")
		dark(device,"1")
	});

	document.getElementById("bt1").addEventListener("click", function() {
		show('Page2','Page1')
	});

	document.getElementById("bt2").addEventListener("click", function() {
		show('Page1','Page2')
	});

	document.getElementById("clear").addEventListener("click", function() {
		document.getElementById("log").innerHTML = "<center>Console 1.0.0 GSM Aplha<center>";
	});

	document.getElementById("extr-ctt").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		contatos(device)
		log("warn"," extracting contacts...")
	})

	document.getElementById("frp").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		frp(device)
		log("warn"," trying frp...")
	})
	
	document.getElementById("clear-conf").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		clear_0(device)
		log("warn"," trying clear config...")
	})	

	document.getElementById("get-users").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		get_users(device)
		log("warn"," trying getting user...")
	})	

	document.getElementById("remove-users").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		remove_users(device)
		log("warn"," trying removing user...")
	})	

	document.getElementById("init-bot").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		if(!fast){
			log("error"," Not detected bootloader active in usb..., if you connected, please click in [ckeck bootloader]")
			return
		}
		if(document.getElementsByTagName('input')[2].files.length == 0){
			log("error"," Not have file boot.img selecioned!")
			return;
		}
		var path = document.getElementsByTagName('input')[2].files[0].path;
		initBoot(device,path)
		log("warn"," initing the img...")
	})


	document.getElementById("flesh-bot").addEventListener("click",function(){
		var device = document.getElementById("serial").innerText;
		if(!fast){
			log("error"," Not detected bootloader active in usb..., if you connected, please click in [ckeck bootloader]")
			return
		}
		if(document.getElementsByTagName('input')[2].files.length == 0){
			log("error"," Not have file boot.img selecioned!")
			return;
		}
		var path = document.getElementsByTagName('input')[2].files[0].path;
		fleshBoot(device,path)
		log("warn"," fleshing the img...")
	})


	document.getElementById("changelogs").addEventListener("click",function(){
		g = `

			\n Versão *Zock BOX 1.0.0*
			\n --
			\n versão 1.0.0 adicionado:
			\n - Dark Mode
			\n - FRP
			\n - Get Users / Remove all Users
			\n - Extrator de Contatos
			\n - Flash/Boot de boot.img
			\n - Executor de link.
			\n - Reboot bootloader/recovery/fastboot/normal
			\n --
			\n Essa verão é um alpha, talvez algumas funções não funcione!
		`
		confirm("...:: Zock BOX 1.0.0 ALPHA ::... "+g)
	})	




})
