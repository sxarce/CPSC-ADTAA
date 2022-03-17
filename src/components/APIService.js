
export default class APIService{

	// Insert an article
	
	// static InsertArticle(body){
	// 	return fetch(`http://localhost:5000/add`,{
    //   		'method':'POST',
    //   		 headers : {
    //   		'Content-Type':'application/json'
    //   },
    //   body:JSON.stringify(body)
    // })
	// .then(response => response.json())
	// .catch(error => console.log(error))
	// }

    static InsertUser(body){
		return fetch('http://localhost:5000/register-user',{
      		'method':'POST',
      		 headers : {
      		'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    })
	.then(response => response.json())
	.catch(error => console.log(error))
	}

}
