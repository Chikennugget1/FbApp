var FriendModel      = Backbone.Model.extend({});

var FriendCollection = Backbone.Collection.extend({
	model:FriendModel,
	
	/* Variables d'instance pour les statistiques (amélioration : utiliser un tableau par exemple) */
	maleCount: 0,
	femaleCount : 0,
	unknownCount : 0,
	birthdayCount : 0,
	noBirthdayCount : 0,
	friends500 : 0,
	friends500_100 : 0,
	friends100 : 0,
	age15_18 : 0,
	age18_25 : 0,
	age25 : 0,
	statusSingle : 0,
	statusCouple : 0,
	statusUnknown : 0,
	

    sortByNames: function(){
		this.reset(this.sortBy(function(friendModel){
          return friendModel.get('first_name');
        }));
       // this.trigger('reset');
      },

	removeSearch: function(){
		//Reset collection
		//Emit change:search
		this.trigger('reset',this);
		this.trigger('change:search', '');
	},

      sortByBirthdays: function(){
        // See. http://backbonejs.org/#Collection-Underscore-Methods
        // See. http://backbonejs.org/#Collection-reset
        this.reset(this.sortBy(function(friendModel){ //On peut faire reset ici car nous ne modifions pas la collection (on ne perd rien dans la liste), dans le cas d'une recherche ça pose problème car on supprime les modèles pour en afficher qu'un certain nombre.
          return friendModel.get('birthday_date');
        }));
        //this.trigger('reset');
      },


      searchFor : function(token){
		token = token.toLowerCase();
		var filteredCollection = 
		this.filter(function(model){
			return  model.get('first_name').toLowerCase().indexOf(token) !== -1 ||
                 	model.get('last_name').toLowerCase().indexOf(token) !== -1 ||
                 	(model.get('birthday_date') || '').toLowerCase().indexOf(token) !== -1 ||
                 	(model.get('hometown_location') ? model.get('hometown_location').name.toLowerCase().indexOf(token) !== -1 : false) ||
                 	(model.get('relationship_status') || '').toLowerCase().indexOf(token) !== -1;
			
			});
		this.trigger('filter',filteredCollection);
		this.trigger('change:search',token);
		
		//this.setCounts(token);

	},
	
	
	/** Mise à jour des statistiques selon la collection actuelle*/
	setCounts: function(token){
		var collectionToUse;
	
		if(token != null) //Token non vide = on fait une recherche
		{
			token = token.toLowerCase();
			var filteredCollection = 
			this.filter(function(model){
				return  model.get('first_name').toLowerCase().indexOf(token) !== -1 ||
						model.get('last_name').toLowerCase().indexOf(token) !== -1 ||
						(model.get('birthday_date') || '').toLowerCase().indexOf(token) !== -1 ||
						(model.get('hometown_location') ? model.get('hometown_location').name.toLowerCase().indexOf(token) !== -1 : false) ||
						(model.get('relationship_status') || '').toLowerCase().indexOf(token) !== -1;
				
			});
			collectionToUse = filteredCollection;
			
			
		}
		
		else //Si token vide -> on est dans l'initialisation des graphiques, on récupère les statistiques sur l'ensemble des amis
		{
			collectionToUse = this;	
		}
		
		this.maleCount = collectionToUse.filter(function(n){return n.get('sex') === "male";}).length;
		this.femaleCount = collectionToUse.filter(function(n){return n.get('sex') === "female";}).length;
		this.unknownCount = collectionToUse.filter(function(n){return n.get('sex') === "";}).length;
			
		this.birthdayCount = collectionToUse.filter(function(n) { return n.get('birthday_date'); }).length;
		this.noBirthdayCount = collectionToUse.filter(function(n) { return !(n.get('birthday_date')); }).length;
			
		this.friends500 = collectionToUse.filter(function(n) { return (n.get('friend_count') >= 500); }).length;
		this.friends500_100 = collectionToUse.filter(function(n) { return (n.get('friend_count') < 500 && n.get('friend_count') >= 100);}).length;
		this.friends100 = collectionToUse.filter(function(n) { return (n.get('friend_count') < 100);}).length;
			
		this.age15_18 = collectionToUse.filter(function(n) { return ( n.get('birthday_date') != null  
				&& n.get('birthday_date').split("/").pop() < "1998" 
				&& n.get('birthday_date').split("/").pop() >= "1995" ); 
			}).length;
			
		this.age18_25 = collectionToUse.filter(function(n) { return (n.get('birthday_date') != null  
				&& parseInt(n.get('birthday_date').split("/").pop()) >= parseInt("1988") 
				&& parseInt(n.get('birthday_date').split("/").pop()) < parseInt("1995")); 
			}).length;
		
		this.age25 = collectionToUse.filter(function(n) { return (n.get('birthday_date') != null  
				&& parseInt(n.get('birthday_date').split("/").pop()) < parseInt("1988"))
			}).length;
			
		this.statusSingle = collectionToUse.filter(function(n){return n.get('relationship_status') === "Single";}).length;
		this.statusCouple = collectionToUse.filter(function(n){return n.get('relationship_status') === "In a Relationship";}).length;
		this.statusUnknown = collectionToUse.filter(function(n){return n.get('relationship_status') == null;}).length;
			
		

	},
	
		 
	/** Fonctions qui servent à retourner les valeurs des variables d'instances aux graphiques (les valeurs sont mises à jour dans setCounts ci-dessus  */ 
		 
	/* Répartition par sexe */
	getMaleCount: function(){
		return this.maleCount;
	},
	 
	 getFemaleCount: function(){
		return this.femaleCount;
	 },
	 
	 getUnknownSexCount: function(){
		return this.unknownCount;
	 },
	 
	 /* Répartition par ceux qui ont mis leur date d'anniversaire */
	 getBirthdayCount: function(){
		return this.birthdayCount

	 },
	 
	 getNoBirthdayCount: function(){
		 return this.noBirthdayCount
	 },
	 
	 /* Nombre d'amis */
	 
	 get500Friends: function(){
		return this.friends500;
	 },
	 
	 get500_100Friends: function(){
		return this.friends500_100
	 },
	 
	 get100LessFriends: function(){
		return this.friends100;
	 },
	 
	 
	 /* Répartition des âges */
	 getAge15_18: function(){
		 return this.age15_18;
	 },
	 
	 getAge18_25: function(){
		return this.age18_25;
	 },
	 
	 getAge25: function(){
		return this.age25;
	 }, 
	 
	 /* Répartition des statuts (en couple, célibataire...) */
	 getStatusSingle: function(){
	 	return this.statusSingle;
	 },
	 
	 getStatusCouple: function(){
		return this.statusCouple;
	 },
	 
	 getStatusUnknown: function(){
		return this.statusUnknown;
	 }, 
	 
	 
    });