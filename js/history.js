// History is based on javascript kata (javascriptkata.com, http://github.com/dsimard/jskataUndo/raw/master/jsk.undo.js)
NW.history = {
	  dids : [],
	  undids : [],
	  // deprecated : Push an undo function
	  push : function(undoFunction) {
		  NW.history.fire(null, undoFunction);
	  },
	  // Do something that can be undone
	  fire : function(fireFunction, undoFunction) {
	    if (NW.history.isFct(fireFunction)) { 
	      fireFunction();
	      NW.history.undids = [];
	    } else {
	    	eval(fireFunction);
	    	NW.history.undids = [];
	    }
  	    
  	  //}
  	  
  	  NW.history.dids.push({fire:fireFunction, undo:undoFunction});
  	  
      NW.history.fireEvents();
	  },
	  // Undo
	  undo : function() {
		  var fct = NW.history.dids && NW.history.dids.length > 0 ? NW.history.dids.pop() : null;
		  if (!fct) return false;
		  if (NW.history.isFct(fct["undo"])) {
		    fct["undo"]();
		    // There can be no "fire" so don't push a redo
		    NW.history.undids.push({fire:fct["fire"], undo:fct["undo"]});
		  } else if (fct) {
		  	eval(fct["undo"]);
		  	// There can be no "fire" so don't push a redo
		  	NW.history.undids.push({fire:fct["fire"], undo:fct["undo"]});
		  }
		    
		    
		  //}
	  	
	  	NW.history.fireEvents();
	  },
	  // Redo
	  redo : function() {
	    var fct = NW.history.undids && NW.history.undids.length > 0 ? NW.history.undids.pop() : null;
	    if (!fct) return false;
	    if (NW.history.isFct(fct["fire"])) {
	      fct["fire"]();
	      // Put the redo in dids
	      NW.history.dids.push({fire:fct["fire"],undo:fct["undo"]});
	    } else if (fct) {
		  	eval(fct["fire"]);
		  	// Put the redo in dids
	      	NW.history.dids.push({fire:fct["fire"],undo:fct["undo"]});
		}
	      
	      
	    //}
	    
	    NW.history.fireEvents();
	  },
	  // Can undo
	  canUndo : function() {
	    return NW.history.dids.length > 0;
	  },
	  // Can Redo
	  canRedo : function() {
	    return NW.history.undids.length > 0;
	  },
	  ///// EVENTS
	  // When there's a change
	  onChange : function() {
		  return false;
	  },
	  // deprecated : when all the fire/undo are empty
	  onEmpty : function() {
		  return false;
	  },
	  /// PRIVATE
	  // fired when something changes
	  fireEvents : function() {
		  if (NW.history.onChange) NW.history.onChange();
		  if (NW.history.dids.length == 0 && NW.history.undids.length == 0) NW.history.onEmpty();
	  },
	  // is Function
	  isFct : function(fct) {
	    return fct && typeof fct == "function";
	  }
};

// Shortcut to NW.history.fire()
NW.fire = function(func, undoFunc) {
	NW.history.fire(func, undoFunc);
};
  
  // Creates a namespace if not exist
  /*if (window.jskata == undefined) {
    window.jskata = {};
    window.jsk = window.jskata;
  }
  
  window.jskata.undo = jsk; 
  window.jskataUndo = jsk; // Shortcut for backward compatibility;
  */
//})()