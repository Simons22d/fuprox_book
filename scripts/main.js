let branch_id = JSON.parse(localStorage.getItem("branch_info")).msg.id;
let link = "http://127.0.0.1:1000"
// let link = "http://desktop.fuprox.com";
//
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
	getData(`${link}/services/branch/get`,"POST",{ "branch_id": branch_id},(service)=>{

		if(service.length > 0){
			service.map((data)=>{
			id = data.name;
					handle.append(`
							<div class="custom-width  custom_card outset_card" id=${id}>
							<!-- top modal -->
							<div class="row" id=${id}>
								<div class="col-lg-3" id=${id}>
									<!-- image -->
									<img src="./images/error.png" alt="" class="texts" height="60px" id= ${id}>
								</div>
								<div class="col-lg-7" id= ${id}>
									<div class="col-lg-12"><h5 class="texts muted-text" id= ${id}>${data.name}</h5></div>
									<div class="col-lg-12"><h5 class="texts muted-text" id= ${id}>Till No ${data.teller}</h5></div>
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

	/*
	*
	* <div class="col-lg-12"><h5 class="muted-text" id= ${id}>${data.name}</h5></div>
									<div class="col-lg-12"><h5 class="muted-text" id= ${id}>Till No ${data.teller}</h5></div>
									<div class="col-lg-12" id= ${id} ><span id="online-${id}">${online_data.length}</span> online bookings</div>
									<div class="col-lg-12" id= ${id} ><span id="offline-${id}">${offline_data.length}</span> local bookings</div>
								</div>
	* */
	// verify key
	//  check if key exists
	//  it does not make a requst for another one in a child window


	const key_exists = () =>{
		return localStorage.getItem("myCat");
	}

	//  get branch data
	// let branch_handle  = $("#branch")
	// let date_handle = $("#date")
	// getData(`${link}/branch/by/key`,"POST",{"key":key},(data)=>{
	// 	if(data){
	// 		// getting the  comapny data
	// 		getData(`${link}/company/by/id`,"POST",{"id":data.company},(company_data)=>{
	// 			let final = `${data.name} — ${company_data.name}`
	// 			branch_handle.html(final)
	// 			date_handle.html(new Date())
	// 		})
	// 	}
	// })

// working with the booking pop-up
setTimeout(()=>{

    $(".custom_card").on("click",(e)=>{
		let service_name = e.target.id
		sessionStorage.setItem("service_name",service_name)
    	// make booking
		$("#service_name_intext").html(service_name)
		$("#myModal").show()
		$("#iconConfirm").show()
		$("#keyAndSettings").hide()
    })

    // here we are going to have 

},1000)
});

$("#settings").on("click",()=>{
	$("#myModal").show()
	setTimeout(()=>{
		$("#iconConfirm").hide()
		$("#keyAndSettings").show()
	},10)
});

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
	getData(`${link}/branch/by/key`,"POST",{"key" : key},(data)=>{
		console.log(">>>>>>",data)
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
})

$("#verifyTicket").on("click",()=>{
	getData(`${link}/booking/make`,"POST",{"service_name":sessionStorage.getItem("service_name"),"branch_id":branch_id,"is_instant":"","user_id":0},(data)=>{
	  let thisBooking=$("#thisBooking")
		thisBooking.html(data.code);
		let thisHandle = $(`#offline-${sessionStorage.getItem("service_name")}`);
		getData(`${link}/customer/local/booking`,"POST",{"branch_id":branch_id,"service_name":sessionStorage.getItem("service_name")},(online_data)=>{
			thisHandle.html(online_data.length);
			$("#ticket_message").html("<div class=\"alert alert-success col-lg-6\" role=\"alert\">Booking Successfully Made</div>")
		})
		setTimeout(()=>{
			$("#myModal").hide()
			$("#ticket_message").html("")
		},2000)
	})
})

