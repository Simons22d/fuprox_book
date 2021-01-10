let branch_id = JSON.parse(localStorage.getItem("branch_info")) ? JSON.parse(localStorage.getItem("branch_info")).msg.id : 1;
let ticket = $("#ticket");


let addr = localStorage.getItem("server_ip")
let link = `http://${addr}:1000`

//setting the key
setTimeout(()=>{
	console.log(addr)
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


$(function() {
	let	handle = $("#services")
	// here we are profilling the DOM
	if(JSON.parse(localStorage.getItem("branch_info"))){
		getData(`${link}/services/branch/get`,"POST",{ "branch_id": branch_id},(service)=>{
			if(service.length > 0){
				service.map((data)=>{
					let name = data.name.split(" ")
					let service_name = name.length > 1 ? `${name[0]}_${name[1]}` : data.name;
					id = service_name;
					handle.append(`
							<div class="custom-width  custom_card outset_card" id=${id}>
							<!-- top modal -->
							<div class="row" id=${id}>
								<div class="col-lg-3" id=${id}>
									<!-- image -->
									<img src=${data.icon_image} alt="" class="texts" height="60px" id= ${id}>
								</div>
								<div class="col-lg-7" id=${id}>
								
									<div class="col-lg-12"><h5 class="texts muted-text bold" id= ${id}>${data.name}</h5></div>
									<div class="col-lg-12"><h5 class="texts muted-text bold" id= ${id}>Till No ${data.teller}</h5></div>
									
								</div>
							</div>
							<!-- end top -->
						</div>
					`)
				})
			}else{
				console.log("no service Data  ")
				$("#services").html("<h3 style='color:lightgrey'>No Services added yet</h3>")
			}
		});
	}else{
		$("#services").html("" +
			"<h3 style='color:lightgrey'>App Not Activated</h3>" +
			"<p style='color:lightgrey' class='h6'>Please add a branch key.</p>" +
			"")
	}


const key_exists = () =>{
	return localStorage.getItem("myCat");
}

// working with the booking pop-up

    // here we are going to have 
});

$("#settings").on("click",()=>{
	$("#myModal").show()
	setTimeout(()=>{
		$("#iconConfirm").hide()
		$("#keyAndSettings").show()
	},10)
});

setTimeout(()=>{
	$(".custom_card").on("click",(me)=>{
		let id = me.target.id
		console.log(id)

		let service_name = id ? id : localStorage.getItem("current_service");
		localStorage.setItem("current_service",id)
		localStorage.setItem("service_name",service_name)
		sessionStorage.setItem("service_name",localStorage.getItem("service_name"));

		ticket.show()
		let spl = service_name.split("_");
		let king = service_name.split("_").length > 1 ? `${spl[0]} ${spl[1]}` : service_name ;
		sessionStorage.setItem("service_name",service_name);
		// localStorage.setItem("current_service",id)
		// make booking
		$("#service_name_intext").html(king);
		$("#myModal").show()
		$("#iconConfirm").show()
		$("#keyAndSettings").hide()
	})
},1000)

$(".close").on("click",()=>{
	$("#myModal").hide()
});

setTimeout(()=>{
	let key = localStorage.getItem("key")
	getData(`${link}/branch/by/key`,"POST",{"key" : key},(data)=>{
		if(data.status){
			$("#branch").html(data.msg.name)
			$("#date").html(new Date())
		}else{
			$("#branch").html("——")
		}
	})
},10)

const verifyKey = (key) => {
	getData(`${link}/branch/by/key`,"POST",{"key" : key.trim()},(data)=>{
		if (data.status){
			// #store key in localStorage
			$("#message_key").html(`<div class="alert alert-success" role="alert">Valid Key</div>`)
			localStorage.setItem("key",key)
			localStorage.setItem("branch_info",JSON.stringify(data))
			$("#verifyKey").prop("disabled",true)
			$("#key").removeClass("is-invalid")
		}else{
			// key not valid
			// replace dowm with on invalid key
			$("#message_key").html(`<div class="alert alert-danger" role="alert">Key Is Not Valid</div>`)
			$("#key").addClass("is-invalid")
		}
	})
}

// print ticket 
const printTicket = () =>{

}

$("#verifyKey").on("click",()=>{
	let key = $("#key").val()
	if(key) {
	//	message_key
		verifyKey(key)
	}else {
		$("#message_key").html(`<div class="alert alert-danger" role="alert">Key cannot Be empty</div>`)
	}
})

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
	
		getData(`${link}/get/ticket/data`,"POST",{"booking_id": data.booking_id,"key" : JSON.parse(localStorage.getItem("branch_info")).msg.key_},(ticket_data)=>{
			$("#company").html(ticket_data.company)	
			$("#branch_id").html(ticket_data.branch_name)
			// here we are going to work with time 
			let hrs = ticket_data.avg_time.hours
			let mins = ticket_data.avg_time.minutes
			let secs = ticket_data.avg_time.seconds
			console.log(mins,secs);

			let final_time 
			 if(Number(mins) > 0 && Number(secs) > 0 || Number(mins) > 0 && Number(secs) === 00){
				final_time = `${mins}M ${secs}S`
			}else if(Number(mins) === 0 && Number(secs) > 0){
				final_time = `Few Seconds`
			}
			ref = `${ticket_data.avg_time.minutes} M ${ticket_data.avg_time.seconds} S`
			console.log(final_time);

			$("#avg_wait").html(final_time)
			$("#people_ahead").html(`${ticket_data.pple} People`)
			$("#time_to_end").html(`${ticket_data.approximate_end_time}.`)
			$("#ticket_number").html(`${ticket_data.ticket}`);
			$("#icon").attr("src",ticket_data.icon)
			printJS({printable : 'ticket', type: 'html', targetStyles : ['*']});

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
