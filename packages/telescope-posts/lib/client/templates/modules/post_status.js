Template.post_status.helpers({
	status: function(){
		if (this.status == 1) {
			return {text: "Pending Post", color: "bg-warning"}
		} 
		else if (this.status == 3) {
			return {text: "Rejected Post", color: "bg-danger"}
		} 
		return false;
	}	
});