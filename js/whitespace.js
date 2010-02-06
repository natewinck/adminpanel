/**
 * Licensed under the Creative Commons license by mozilla.org®
 * Modified by me
 */


NW.whitespace = {
	/**
	 * Throughout, whitespace is defined as one of the characters
	 *  "\t" TAB \u0009
	 *  "\n" LF  \u000A
	 *  "\r" CR  \u000D
	 *  " "  SPC \u0020
	 *
	 * This does not use Javascript's "\s" because that includes non-breaking
	 * spaces (and also some other characters).
	 */
	
	
	/**
	 * Determine whether a node's text content is entirely whitespace.
	 *
	 * @param nod  A node implementing the |CharacterData| interface (i.e.,
	 *             a |Text|, |Comment|, or |CDATASection| node
	 * @return     True if all of the text content of |nod| is whitespace,
	 *             otherwise false.
	 */
	is_all_ws: function( nod )
	{
	  // Use ECMA-262 Edition 3 String and RegExp features
	  return !(/[^\t\n\r ]/.test(nod.data));
	},
	
	
	/**
	 * Determine if a node should be ignored by the iterator functions.
	 *
	 * @param nod  An object implementing the DOM1 |Node| interface.
	 * @return     true if the node is:
	 *                1) A |Text| node that is all whitespace
	 *                2) A |Comment| node
	 *             and otherwise false.
	 */
	
	is_ignorable: function( nod )
	{
	  return ( nod.nodeType == 8) || // A comment node
			 ( (nod.nodeType == 3) && NW.whitespace.is_all_ws(nod) ); // a text node, all ws
	},
	
	/**
	 * Version of |previousSibling| that skips nodes that are entirely
	 * whitespace or comments.  (Normally |previousSibling| is a property
	 * of all DOM nodes that gives the sibling node, the node that is
	 * a child of the same parent, that occurs immediately before the
	 * reference node.)
	 *
	 * @param sib  The reference node.
	 * @return     Either:
	 *               1) The closest previous sibling to |sib| that is not
	 *                  ignorable according to |NW.whitespace.is_ignorable|, or
	 *               2) null if no such node exists.
	 */
	node_before: function( sib )
	{
	  while ((sib = sib.previousSibling)) {
		if (!NW.whitespace.is_ignorable(sib)) return sib;
	  }
	  return null;
	},
	
	/**
	 * Version of |nextSibling| that skips nodes that are entirely
	 * whitespace or comments.
	 *
	 * @param sib  The reference node.
	 * @return     Either:
	 *               1) The closest next sibling to |sib| that is not
	 *                  ignorable according to |NW.whitespace.is_ignorable|, or
	 *               2) null if no such node exists.
	 */
	node_after: function( sib )
	{
	  while ((sib = sib.nextSibling)) {
		if (!NW.whitespace.is_ignorable(sib)) return sib;
	  }
	  return null;
	},
	
	/**
	 * Version of |lastChild| that skips nodes that are entirely
	 * whitespace or comments.  (Normally |lastChild| is a property
	 * of all DOM nodes that gives the last of the nodes contained
	 * directly in the reference node.)
	 *
	 * @param sib  The reference node.
	 * @return     Either:
	 *               1) The last child of |sib| that is not
	 *                  ignorable according to |NW.whitespace.is_ignorable|, or
	 *               2) null if no such node exists.
	 */
	last_child: function( par )
	{
	  var res=par.lastChild;
	  while (res) {
		if (!NW.whitespace.is_ignorable(res)) return res;
		res = res.previousSibling;
	  }
	  return null;
	},
	
	/**
	 * Version of |firstChild| that skips nodes that are entirely
	 * whitespace and comments.
	 *
	 * @param sib  The reference node.
	 * @return     Either:
	 *               1) The first child of |sib| that is not
	 *                  ignorable according to |NW.whitespace.is_ignorable|, or
	 *               2) null if no such node exists.
	 */
	first_child: function( par )
	{
	  var res=par.firstChild;
	  while (res) {
		if (!NW.whitespace.is_ignorable(res)) return res;
		res = res.nextSibling;
	  }
	  return null;
	},
	
	/**
	 * Version of |data| that doesn't include whitespace at the beginning
	 * and end and normalizes all whitespace to a single space.  (Normally
	 * |data| is a property of text nodes that gives the text of the node.)
	 *
	 * @param txt  The text node whose data should be returned
	 * @return     A string giving the contents of the text node with
	 *             whitespace collapsed.
	 */
	data_of: function( txt )
	{
	  var data = txt.data;
	  // Use ECMA-262 Edition 3 String and RegExp features
	  data = data.replace(/[\t\n\r ]+/g, " ");
	  if (data.charAt(0) == " ")
		data = data.substring(1, data.length);
	  if (data.charAt(data.length - 1) == " ")
		data = data.substring(0, data.length - 1);
	  return data;
	}
};