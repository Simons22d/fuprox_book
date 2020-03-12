branch_id = 1;
country_id = 1;
const key = "080b988760e1b4e769be96a125bc38d381d41a8133539fe03a1de1bccafc7a79dad93e987e5505d78ff53b128df7564255509e7de2950cb5e957e78355fa09a5f77a10787f12bf4f4066223225dca3f1f162665cbcb3b936aab784b34be80fe3b68ea195c156cc0272cc28902b2fefc44e96508e5553734a06e3b085bca8907cfdeb2e6cfd2786ca27cbc7876318e3eb9d7c9b40cf4287ca6857615435b53bcfc46db3718c57e07b3be9951a97615e981d33b4611be6011a8f4d39de82a21a3382fdaa3531a3a610b64740515f840512472347297fcb9caebffffec35aa24abb0f9d2dd94595e3190db4897b1e205ae129feca90f8abd785428867e238bb4013484f978c83d30fa7fdbfcd3115ca87fc84d03ec6e9e7a1dacbe83300711581ee7edc6d843b22eda5a0cdd80d8b83d729b4505075329017d663e56990391aaaebe25bc90c075b5bdf824db7562550713c1215d7b623f5d7cbd07bb6e6f4783984e577b833daf17dcafb4d45638f655098d0852e2cfc3fccc05409ae9b7396786cd45f01d11dd6e11a6d3715359a7bb9bfa6ab28b993c6700177dd41aa5a076023a6324ff8f9a538ff4597c25d9e5784de256b44f6152d482759b4f61666e1a710bd9e644f3f9e98ad066658bde80f5f4aa0e3aac7fced121292042d0bfb19d425dda8bd5defbaa069e04ce012d573300bf77a9fc5cd7c697b2744b38acc2957db0fb64a9fdb91dc6d96825976f1a1ab6cb17598ecc14a79138e7fe421105b4bce660981ec8172fb4cab6fc5579b1cc5a8d32872ca3b69a290e618fa90355733993cc23cde190710d9db7f4ff1e467846a02898a1f4e88340c8d81b26215512743a6036b1fc1fbac7698861298c4dec15c2572162ea3c2331fc7a650c8917447134632058d37b9de9b552fe6e5583b839d686fca20bc5098f06758d93bcad8ab6f54d2592e7aecfd2f2e7cc8c62e25dabefe70fb3d8903956f86eadb72a49079a047bfe4183b922fdd73c8278b3d2cc450320edf7e8e7e97dafc7a79c1b5e83594fa5bfce1c0bf7ac2999399850c49a13b637725b66d54cfc9129eb8a26091fef7755573076858bfa534b7076fedda1429a0c8a5f8b650d71408d80419d15afca8bded6e4ef0355101b5c80115600da758b2255832b0700c26f9f4457bb2e131726130faa7e4232a0933fb863bf3d8af497331d3c1d6b7332b9f4d1e3a420f6af9329840cb763e2486f7932c87d9f6fc4939891d6a4d4a244b6b7c387adb6e9fbc83dd0e93cc970e40e8856a88c83ab319f349172bba8c91a643b4513addff812771899ccd13a061eb896a5736d8b7e1206ae7ed00b8f2b36e26de5b99f9e05636a5dd4f3b50cbddc34f88d9938d0dce152bfde1f70c022700b310a10e7cf7eee55961f720d97f6752e46eb50d5e8330f5815b88abe5c8e8d4c2466af4e35d4cff"
let link = "http://desktop.fuprox.com"

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
}
$(function() {

	let	handle = $("#services")

	// here we are profilling the DOM
	getData(`${link}/services/branch/get`,"POST",{ "branch_id": 1},(service)=>{
		service.map((data)=>{
			getData(`${link}/customer/online/booking`,"POST",{"branch_id":data.branch_id,"service_name":data.name},(online_data)=>{
				getData(`${link}/customer/local/booking`,"POST",{"branch_id":data.branch_id,"service_name":data.name},(offline_data)=>{
					id = data.name
					handle.append(`
							<div class="custom-width  custom_card outset_card" id=${id}>
							<!-- top modal -->
							<div class="row" id=${id}>
								<div class="col-lg-3" id=${id}>
									<!-- image -->
									<img src="./images/error.png" alt="" height="60px" id= ${id}>
								</div>
								<div class="col-lg-7" id= ${id}>
									<div class="col-lg-12"><h5 class="muted-text" id= ${id}>${data.name}</h5></div>
									<div class="col-lg-12"><h5 class="muted-text" id= ${id}>Till No ${data.teller}</h5></div>
									<div class="col-lg-12" id= ${id} ><span id="online-${id}">${online_data.length}</span> online bookings</div>
									<div class="col-lg-12" id= ${id} ><span id="offline-${id}">${offline_data.length}</span> local bookings</div>
								</div>
							</div>
							<!-- end top -->
						</div>
					`)
				})
			})
		})

	})


	// verify key 
	//  check if key exists
	//  it does not make a requst for another one in a child window


	const key_exists = () =>{
		return localStorage.getItem("myCat");
	}

	//  get branch data 
	let branch_handle  = $("#branch")
	let date_handle = $("#date")
	getData(`${link}/branch/by/key`,"POST",{"key":key},(data)=>{
		if(data){
			// getting the  comapny data 
			getData(`${link}/company/by/id`,"POST",{"id":data.company},(company_data)=>{
				final = `${data.name} — ${company_data.name}`
				branch_handle.html(final)
				date_handle.html(new Date())
			})
		}
	})

setTimeout(()=>{
    console.log( $(".custom_card") );
    $(".custom_card").on("click",(e)=>{
    	service_name = e.target.id
    	// make booking 
    	getData(`${link}/booking/make`,"POST",{"service_name":service_name,"branch_id":branch_id},(data)=>{
    		console.log(data)
    		thisHandle = $(`#offline-${service_name}`)
    		getData(`${link}/customer/local/booking`,"POST",{"branch_id":branch_id,"service_name":service_name},(online_data)=>{
				console.log("online_data",online_data)
				thisHandle.html(online_data.length)
			})
    	})
    })

    // here we are going to have 

},1000)
});



