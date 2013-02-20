 var AppView          = Backbone.View.extend({
      events:{
        "click #byName":"sortByNames",
        "click #byBirthday":"sortByBirthdays",
		"keyup #filter":"search",
		"click #removeSearch":"removeSearch"
      },

      sortByNames: function(){
        this.friends.sortByNames();
      },

      sortByBirthdays: function(){
        this.friends.sortByBirthdays();
      },

	search: function(e){
		//console.log(this,e);//this -> le contexte = la vue
		this.friends.searchFor(e.currentTarget.value);
		this.friends.setCounts(e.currentTarget.value);
		this.drawCharts();

	},

	removeSearch: function(){
		this.friends.removeSearch();
	},

	clearInput: function(token){
		if(token){return;}
		this.$el.find('input').val('');
	},
	
	drawCharts: function(){
		this.drawChartGender();
		this.drawChartBirthday();
		this.drawChartFriends();
		this.drawChartAges();
		this.drawChartStatus();
	
	},
	 
	 
	 /** Créer les différents graphiques pour les statistiques (une fonction par graph Google , à améliorer en 1 seule fonction prenant en param les stats à évaluer) */
	 drawChartGender: function() {        
		 var data = google.visualization.arrayToDataTable([          
		 ['Gender', 'Repartition'],
		 ['Male',     this.friends.getMaleCount()],       
		 ['Female',   this.friends.getFemaleCount()],  
		 ['N/A',      this.friends.getUnknownSexCount()],  
		 ]);        
		 var options = {
		 title: 'Gender repartition'       
		 };        
		 var chart = new google.visualization.PieChart(document.getElementById('chart_gender'));        
		 chart.draw(data, options);      
	 },  
	 
	 drawChartBirthday: function() {        
		 var data = google.visualization.arrayToDataTable([          
		 ['Given', 'Birthdays'],
		 ['Has birthday',     this.friends.getBirthdayCount()],       
		 ['N/A',      		  this.friends.getNoBirthdayCount()]  
		 ]);        
		 var options = {
			title: 'Given birthdays'       
		 };        
		 var chart = new google.visualization.PieChart(document.getElementById('chart_birthday'));        
		 chart.draw(data, options);      
	 },  
	 
	 drawChartFriends: function() {        
		 var data = google.visualization.arrayToDataTable([          
		 ['Friends', 'Count'],
		 ['500 +',     		this.friends.get500Friends()],       
		 ['100-500',      	this.friends.get500_100Friends()],
		 ['Less than 100',  this.friends.get100LessFriends()]
		 ]);        
		 var options = {
			title: 'Friends count'       
		 };        
		 var chart = new google.visualization.PieChart(document.getElementById('chart_friends'));        
		 chart.draw(data, options);      
	 },  
	 
	 drawChartAges: function() {        
		 var data = google.visualization.arrayToDataTable([          
		 ['Age', 'Repartition'],
		 ['15-18',     	this.friends.getAge15_18()],       
		 ['18-25',      this.friends.getAge18_25()],
		 ['25+',      	this.friends.getAge25()]
		 ]);        
		 var options = {
			title: 'Age repartition'       
		 };        
		 var chart = new google.visualization.PieChart(document.getElementById('chart_ages'));        
		 chart.draw(data, options);      
	 },  
	 
	 drawChartStatus: function() {        
		 var data = google.visualization.arrayToDataTable([          
		 ['Relationship', 'Status Repartition'],
		 ['Single',     		this.friends.getStatusSingle()],       
		 ['In a Relationship',  this.friends.getStatusCouple()],
		 ['N/A',      			this.friends.getStatusUnknown()]
		 ]);        
		 var options = {
			title: 'Relationship status repartition'       
		 };        
		 var chart = new google.visualization.PieChart(document.getElementById('chart_status'));        
		 chart.draw(data, options);      
	 },  

      initialize: function(options){
        _.extend(this, options);
        // FriendsViews array
        this.subViews    = [];
        // $friendList HTML element wrapped with jQuery
        this.$friendList = this.$el.find('.friend-list');
        // Listen on collection reset event to render the FriendViews
        // See: http://backbonejs.org/#Collection-reset
        this.friends.on("reset", this.renderFriends, this);
		this.friends.on("filter", this.renderFriends, this);
		this.friends.on("reset", this.updateFriendsCount, this);
		this.friends.on("filter", this.updateFriendsCount, this);
		this.friends.on("change:search", this.changeSearchMode, this);
		this.friends.setCounts();
		
		google.load("visualization", "1", {packages:["corechart"]});
		google.setOnLoadCallback(this.drawChartGender);  
		google.setOnLoadCallback(this.drawChartBirthday);  
		google.setOnLoadCallback(this.drawChartFriends);  
		google.setOnLoadCallback(this.drawChartAges);  
		google.setOnLoadCallback(this.drawChartStatus);  
      },
	
	updateFriendsCount: function(coll){
		this.$el.find('.friendsCount span').text(coll.length);

	},

	changeSearchMode: function(token){
		/*if(!token || token.length === 0)
		{
			this.$el.removeClass('searchmode');
		}

		else
		{
			this.$el.addClass('searchmode');
		} */
		this.$el.toggleClass('searchmode', token || token.length > 0);
	},
	


      /**
       * Render the `friends` collection with FriendViews
       * @return {AppView}
       * @chainable
       */
      renderFriends: function(collection){
	//console.log(arguments);
        // Remove all old FriendViews
        this.subViews.forEach(function(friendView){
          friendView.remove(); // see http://backbonejs.org/#View-remove
        });

        collection.forEach(function(friendModel){
          var view = new FriendView({
            model: friendModel
          });
          this.subViews.push(view);
          view.render().$el.appendTo(this.$friendList); //on ajoute la liste au conteneur (el)
        }, this);

        return this;
      }
    });