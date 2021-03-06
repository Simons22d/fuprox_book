let branch_id = JSON.parse(localStorage.getItem("branch_info")) ? JSON.parse(localStorage.getItem("branch_info")).id : 1;
let ticket = $("#ticket");


let addr = localStorage.getItem("server_ip")
let link = `http://${addr}:1000`

//setting the key
setTimeout(()=>{
	if(addr){
		$("#server_ip").attr("placeholder",`Currently Set As '${addr}'`)
	}else{
		$("#server_ip").attr("placeholder",`Please Set Address Before using app.`)
	}
},500)


$("#set_server_ip").on("click",()=>{
	let server_ip = $("#server_ip").val()
	if(server_ip){
		localStorage.setItem("server_ip",server_ip)
		$("#server_ip").attr("placeholder",`Currently Set As '${addr}'`)
		$("#message_ip").html(`<div class="alert alert-success" role="alert">Success! Make sure to restart app.<br> for changes to take effect</div>`)
		reload()
	}
})


const getData = (url,methods,data,handle) => {
	fetch(url,{
	  method: methods,
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(data)
	})
	.then(res=>res.json())
	.then(res => handle(res));
};
// socket implementation .....


// const sio = io("http://localhost:5500/");

const sio = io(`http://${addr}:5500/`);
// const sio = io(`http://159.65.144.235:5000/`);


sio.on('connect', () => {
  console.log('connected');
});

sio.on('disconnect', () => {
  console.log('disconnected');
});

sio.on('service_mod_data', () => {
	loadTiles();
	reload();
});


// end socket implementation
sio.on("update_services_data",()=>{
	loadTiles();
	reload();
})


$(function() {
loadTiles();

const key_exists = () =>{
	return localStorage.getItem("myCat");
}

// working with the booking pop-up
// here we are going to have 

// setTimeout(()=>{
// 	$(".custom_card").on("click",(me)=>{
// 		let id = me.target.id
// 		let service_name = id ? id : localStorage.getItem("current_service");
// 		if (service_name && id){
// 			localStorage.setItem("current_service",id)
// 			localStorage.setItem("service_name",service_name)
// 			sessionStorage.setItem("service_name",localStorage.getItem("service_name"));
// 			ticket.show()
// 			let spl = service_name.split("_");
// 			let king = service_name.split("_").length > 1 ? `${spl[0]} ${spl[1]}` : service_name ;
// 			sessionStorage.setItem("service_name",service_name);
//
// 			// make booking
// 			$("#service_name_intext").html(king);
// 			$("#myModal").show()
// 			$("#iconConfirm").show()
// 			$("#keyAndSettings").hide()
// 		}else{
//
// 		}
//
// 	})
// },2000)
});



const make_booking = (me) =>{
	let service_name = id ? id : localStorage.getItem("current_service");
	localStorage.setItem("current_service",id)
	localStorage.setItem("service_name",service_name)
	sessionStorage.setItem("service_name",localStorage.getItem("service_name"));
	ticket.show()
	let spl = service_name.split("_");
	let king = service_name.split("_").length > 1 ? `${spl[0]} ${spl[1]}` : service_name ;
	sessionStorage.setItem("service_name",service_name);
	localStorage.setItem("current_service",id)
	// make booking
	$("#service_name_intext").html(king);
	$("#myModal").show()
	$("#iconConfirm").show()
	$("#keyAndSettings").hide()
}


const loadTiles = () =>{
	let	handle = $("#services")
	handle.html("")
	// here we are profiling the DOM
	if(JSON.parse(localStorage.getItem("branch_info"))){
		getData(`${link}/services/branch/get`,"POST",{ "branch_id": branch_id},(service)=>{
			console.log(service)
			if(service.length > 0){
				console.log(11)
				service.map((data)=>{
					console.log(22)

					let name = data.name.split(" ")
					let service_name = name.length > 1 ? `${name[0]}_${name[1]}` : data.name;
					id = service_name;
					handle.append(`
						<div class="custom-width  custom_card  custom_card_ outset_card" id=${id} onclick="make_booking(this)">
							<!-- top modal -->
							<div class="row custom_card_" id=${id} ">
								<div class="col-lg-3 custom_card_" id=${id} ">
									<!-- image -->
									<img src=${data.icon_image} alt="" class="texts custom_card_" height="60px" id= ${id} ">
								</div>
								<div class="col-lg-7 custom_card_" id=${id} ">
									<div class="col-lg-12 custom_card_"><h5 class="texts muted-text bold" id= ${id} ">${data.name} </h5></div>
									<div class="col-lg-12 custom_card_"><h5 class="texts muted-text bold" id= ${id} ">Till No ${data.teller}</h5></div>
								</div>
							</div>
							<!-- end top -->
						</div>
					`)
				})
			}else{
				$("#services").html(`
					<div>
					<img src="./images/empty.png" alt="" height="150px" class="mt-3 mb-3">
					<div class="mt-2 text-muted h6 bold">Nothing To Book</div>
					<div class="mt-2 text-muted h5 bold">No Services Added yet</div>
					</div>
				`)
			}
		});
	}else{
		$("#services").html("" +
			"<h3 style='color:lightgrey'>App Not Activated</h3>" +
			"<p style='color:lightgrey' class='h6'><br>Please add a branch key.</p>" +
			"<br>")
	}

// setTimeout(()=>{
// 	$(".custom_card_").on("click",(me)=>{
// 		console.log("CLICKED >...")
// 		let id = me.target.id
// 		let service_name = id ? id : localStorage.getItem("current_service");
// 		localStorage.setItem("current_service",id)
// 		localStorage.setItem("service_name",service_name)
// 		sessionStorage.setItem("service_name",localStorage.getItem("service_name"));
// 		ticket.show()
// 		let spl = service_name.split("_");
// 		let king = service_name.split("_").length > 1 ? `${spl[0]} ${spl[1]}` : service_name ;
// 		sessionStorage.setItem("service_name",service_name);
// 		// localStorage.setItem("current_service",id)
// 		// make booking
// 		$("#service_name_intext").html(king);
// 		$("#myModal").show()
// 		$("#iconConfirm").show()
// 		$("#keyAndSettings").hide()
// 	})
// },10)


	
}
$("#settings").on("click",()=>{
	$("#myModal").show()
	setTimeout(()=>{
		$("#iconConfirm").hide()
		$("#keyAndSettings").show()
	},10)
});


$(".close").on("click",()=>{
	$("#myModal").hide()
	ticket.hide()
});

const verifyKey = (me) => {
	let key = $("#key").val()
	console.log(key)
	getData(`${link}/app/activate`,"POST",{"key" : key},(data)=>{
		console.log(data)
		if(data){
			localStorage.setItem("branch_info",data)
			console.log("Data available")
			localStorage.setItem("key",data["key_"])
			localStorage.setItem("branch_info",JSON.stringify(data))
			$("#branch").html(data.name)
			$("#date").html(data["today"])
			$("#services").show()

		}else{
			// app not activated
			$("#branch").html(`
			<img src="./images/key.png" alt="" height="40px" class="mt-3">
			<div class="mt-2">Error! Application not activated</div>
			<div class="text-muted">Please make sure you active the application from the backend provided</div>
			`)
			$("#services").hide()
		}
	})
}

verifyKey()



$("#key").on("input",(e)=>{
	$("#verifyKey").prop("disabled",false)
})

// getting the local storage key
if(localStorage.getItem("key")){
	//gettingthe key info
	let key = localStorage.getItem("key")
	if (key.length !== 64){
		//	 there is an issue with the key
		$("#key").attr("placeholder","Activation Key Error!")
		$("#key").addClass("is-invalid")
		$("#verifyKey").prop("disabled",false)
		$("#key").removeClass("is-invalid")
	}else{
		//	key is valid
		$("#key").attr("placeholder",key)
		$("#verifyKey").prop("disabled",true)
	}
}else{
//	no key
}

$("#cancelTicket").on("click",()=>{
	$("#myModal").hide()
	ticket.hide()
})


$("#verifyTicket").on("click",(e)=>{
	setTimeout(()=>{ticket.hide()},500)
	$("#verifyKey").prop("disabled",true)
	let spl = sessionStorage.getItem("service_name").split("_")
	let king = spl.length > 1 ? `${spl[0]} ${spl[1]}` : sessionStorage.getItem("service_name") ;
	getData(`${link}/booking/make`,"POST",{"service_name":king,"branch_id":branch_id,"is_instant":"","user_id":0},(data)=>{
	  let thisBooking=$("#thisBooking")
		thisBooking.html(data.code);


		let thisHandle = $(`#offline-${sessionStorage.getItem("service_name")}`);

		getData(`${link}/get/ticket/data`,"POST",{"booking_id": data.booking_id,"key" : JSON.parse(localStorage.getItem("branch_info")).key_},(ticket_data)=>{
			console.log("TICKET DATA ####################",ticket_data)
			$("#company").html(ticket_data.company)	
			$("#branch_id").html((ticket_data.branch_name).substr(0,32))
			// here we are going to work with time 
			let hrs = Number(ticket_data.avg_time.hours)
			let mins = Number(ticket_data.avg_time.minutes)
			let secs = Number(ticket_data.avg_time.seconds)
			// console.log(hrs,mins,secs)
			let final_time;
			console.log(hrs,mins,secs)
			if(hrs && mins && secs ){
				final_time = `${hrs}H ${mins}M ${secs}S`
			}else if(mins && secs){
				final_time = `${mins}M ${secs}S`
			}else if(mins && secs === 0){
				final_time = `${mins} Minutes`
			}else if(mins == 00 && secs){
				final_time = `Few Seconds`
			}
			ref = `${ticket_data.avg_time.minutes} M ${ticket_data.avg_time.seconds} S`
			console.log(final_time);
			let final_str = ""
			if(ticket_data.pple){
				if(Number(ticket_data.pple) === 1){
					final_str = `${ticket_data.pple} Person`
				}else{
					final_str = `${ticket_data.pple} People`
				}
			}else{
				final_str = "Yay! No one"
			}

			$("#avg_wait").html(final_time)
			$("#today").html(ticket_data.today)
			$("#people_ahead").html(final_str)
			$("#time_to_end").html(`${ticket_data.approximate_end_time}.`)
			$("#ticket_number").html(`${ticket_data.ticket}`);
			$("#icon").attr("src",ticket_data.icon)
			printJS({printable : 'ticket', type: 'html', targetStyles : ['*']});
			sio.emit("hello","")

		})

		getData(`${link}/customer/local/booking`,"POST",{"branch_id":branch_id,"service_name":king},(online_data)=>{
			if(online_data){
				thisHandle.html(online_data.length);
				$("#ticket_message").html("<div class=\"alert alert-success col-lg-6\" role=\"alert\">Booking Successfully Made</div>")
			}else{
				$("#ticket_message").html("<div class=\"alert alert-warning col-lg-6\" role=\"alert\">Error! Booking Could Not be Made</div>")
			}
		})
		setTimeout(()=>{
			$("#myModal").hide()
			$("#ticket_message").html("")
		},1000)
	})
})

const reload = () => {
	setTimeout(()=>{
		document.location.reload()
	},1000)
}
