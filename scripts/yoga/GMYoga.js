// @if feature("flexpanel")
const Yoga = require('/yoga-wasm-base64-csm.js');
var g_yoga = null;
var g_UILayers = null;

async function flexpanel_init()
{
	g_yoga = await Yoga();
}
flexpanel_init();

const YGAlignAuto = 0;
const YGAlignFlexStart = 1;
const YGAlignCenter = 2;
const YGAlignFlexEnd = 3;
const YGAlignStretch = 4;
const YGAlignBaseline = 5;
const YGAlignSpaceBetween = 6;
const YGAlignSpaceAround = 7;
const YGAlignSpaceEvenly = 8;
const YGDirectionInherit = 0;
const YGDirectionLTR = 1;
const YGDirectionRTL = 2;
const YGDisplayFlex = 0;
const YGDisplayNone = 1;
const YGFlexDirectionColumn = 0;
const YGFlexDirectionColumnReverse = 1;
const YGFlexDirectionRow = 2;
const YGFlexDirectionRowReverse = 3;
const YGGutterColumn = 0;
const YGGutterRow = 1;
const YGGutterAll = 2;
const YGJustifyFlexStart = 0;
const YGJustifyCenter = 1;
const YGJustifyFlexEnd = 2;
const YGJustifySpaceBetween = 3;
const YGJustifySpaceAround = 4;
const YGJustifySpaceEvenly = 5;
const YGPositionTypeStatic = 0;
const YGPositionTypeRelative = 1;
const YGPositionTypeAbsolute = 2;
const YGUnitUndefined = 0;
const YGUnitPoint = 1;
const YGUnitPercent = 2;
const YGUnitAuto = 3;
const YGWrapNoWrap = 0;
const YGWrapWrap = 1;
const YGWrapWrapReverse = 2;
const YGEdgeLeft = 0;
const YGEdgeTop = 1;
const YGEdgeRight = 2;
const YGEdgeBottom = 3;
const YGEdgeStart = 4;
const YGEdgeEnd = 5;
const YGEdgeHorizontal = 6;
const YGEdgeVertical = 7;
const YGEdgeAll = 8;
const YGMeasureModeUndefined = 0;
const YGMeasureModeAtMost = 2;
const YGMeasureModeExactly = 1;


var g_positionType = {
	"static" : YGPositionTypeStatic,
	"relative" : YGPositionTypeRelative,
	"absolute" : YGPositionTypeAbsolute,
};

var g_alignType = {
	"auto" : YGAlignAuto,
	"flex-start" : YGAlignFlexStart,
	"center" : YGAlignCenter,
	"flex-end" : YGAlignFlexEnd,
	"stretch" : YGAlignStretch,
	"baseline" : YGAlignBaseline,
	"space-between" : YGAlignSpaceBetween,
	"space-around" : YGAlignSpaceAround,
	"space-evenly" : YGAlignSpaceEvenly,
	"initial" : YGAlignStretch,
};

var g_wrapType = {
	"initial" : YGWrapNoWrap,
	"no-wrap" : YGWrapNoWrap,
	"wrap" : YGWrapWrap,
	"wrap-reverse" : YGWrapWrapReverse,
};

var g_displayType = {
	"flex" : YGDisplayFlex,
	"none" : YGDisplayNone,
};

var g_flexDirectionType = {
	"column" : YGFlexDirectionColumn,
	"column-reverse" : YGFlexDirectionColumnReverse,
	"row" : YGFlexDirectionRow,
	"row-reverse" : YGFlexDirectionRowReverse,
};

var g_justifyType = {
	"flex-start" : YGJustifyFlexStart,
	"center" : YGJustifyCenter,
	"flex-end" : YGJustifyFlexEnd,
	"space-between" : YGJustifySpaceBetween,
	"space-around" : YGJustifySpaceAround,
	"space-evenly" : YGJustifySpaceEvenly,
};

var g_directionType = {
	"ltr" : YGDirectionLTR,
	"rtl" : YGDirectionRTL,
	"inherit" : YGDirectionInherit,
};

var g_contextYoga = new Map();



function FLEXPANEL_StringToEnum( _type, _value)
{
	return _type[ _value ] ?? -1;
}

function FLEXPANEL_SetCSSValue( _node, _value, _set, _setPercent, _setAuto )
{
	var unit = 1;
	if (typeof(_value) == "string") {
		if (_value == "auto" ) unit=3;
		else {
			if (_value.endsWith("%")) {
				unit = 2;
			} // end if

			_value = parseFloat(_value)
		} // end else
	} // end if
	else {
		_value = yyGetReal(_value);
	} // end else

	switch( unit )
	{
	case 1: _set( _node, _value ); break;
	case 2: _setPercent( _node, _value ); break;
	case 3: if (_setAuto != undefined) _setAuto( _node, _value ); break;
	}
}

function FLEXPANEL_SetCSSValueEdge( _node, _value, _edge, _set, _setPercent )
{
	var unit = 1;
	if (typeof(_value) == "string") {
		if (_value.endsWith("%")) {
			unit = 2;
		} // end if

		_value = parseFloat(_value)
	} // end if
	else {
		_value = yyGetReal(_value);
	} // end else

	switch( unit )
	{
	case 1: _set( _node, _value, _edge ); break;
	case 2: _setPercent( _node, _value, _edge ); break;
	}
}

function FLEXPANEL_GetContext(_node)
{
	return g_contextYoga.get( _node["M"]["O"] );	
}

function FLEXPANEL_CreateContext(_node)
{
	g_contextYoga.set( _node["M"]["O"], {} );
}

// #######################################################################################
function FLEXPANEL_Init_From_Struct(_node, _struct)
{
	var context = FLEXPANEL_GetContext(_node);

	var layerElements = undefined;

	for( var key in _struct) {
		if (!_struct.hasOwnProperty(key)) continue;

		var value = _struct[key];

		// translate the JS key back to a GML level key
        if (typeof g_obf2var != "undefined" && g_obf2var.hasOwnProperty(key)) {
            key = g_obf2var[key];
        } // end if

        if (key.startsWith("gml")) {
        	key = key.substring(3);
        }

		switch( key )
		{
		case "nodes":
			// TODO : need to remove all the children
			flexpanel_node_remove_all_children(_node);
			for( var n=0; n<value.length; ++n) {

				var child = g_yoga["Node"]["createDefault"]();
				FLEXPANEL_CreateContext( child );
				_node.insertChild( child, n );

				FLEXPANEL_Init_From_Struct( child, value[n] );

			} // end for
			break;
		case "alignContent":
			_node.setAlignContent( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "alignItems":
			_node.setAlignItems( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "alignSelf":
			_node.setAlignSelf( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "aspectRatio":
			_node.setAspectRatio( yyGetReal(value) );
			break;
		case "display":
			_node.setDisplay( FLEXPANEL_StringToEnum(g_displayType, value) );
			break;
		case "flex":
			value = yyGetReal(value);
			_node.setFlex( value );
			context.flex = value;
			break;
		case "flexGrow":
			_node.setFlexGrow( yyGetReal(value) );
			break;
		case "flexBasis":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setFlexBasis(v) }, function( n, v ) { n.setFlexBasisPercent(v) }, function( n, v ) { n.setFlexBasisAuto(); } );
			break;
		case "flexShrink":
			_node.setFlexShrink( yyGetReal(value));
			break;
		case "flexDirection":
			_node.setFlexDirection( FLEXPANEL_StringToEnum(g_flexDirectionType, value) );
			break;
		case "flexWrap":
			_node.setFlexWrap( FLEXPANEL_StringToEnum(g_wrapType, value) );
			break;
		case "gapColumn":
			_node.setGap( YGGutterColumn, yyGetReal(value) );
			break;
		case "gapRow":
		case "rowGap":
			_node.setGap( YGGutterRow, yyGetReal(value) );
			break;
		case "gap":
			_node.setGap( YGGutterAll, yyGetReal(value) );
			break;
		case "justifyContent":
			_node.setJustifyContent( FLEXPANEL_StringToEnum(g_justifyType, value) );
			break;
		case "direction":
			// RK :: no direction on a node
			//_node.setDirection( FLEXPANEL_StringToEnum(g_directionType, value) );
			context.direction = FLEXPANEL_StringToEnum(g_directionType, value);
			break;
		case "marginLeft":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginStart":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginEnd":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginHorizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginVertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "margin":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeAll, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginInline":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "paddingLeft":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingStart":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingEnd":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingHorizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingVertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "padding":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeAll, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "borderLeft":
			_node.setBorder( YGEdgeLeft, yyGetReal(value));
			break;
		case "borderRight":
			_node.setBorder( YGEdgeRight, yyGetReal(value));
			break;
		case "borderTop":
			_node.setBorder( YGEdgeTop, yyGetReal(value));
			break;
		case "borderBottom":
			_node.setBorder( YGEdgeBottom, yyGetReal(value));
			break;
		case "borderStart":
			_node.setBorder( YGEdgeStart, yyGetReal(value));
			break;
		case "borderEnd":
			_node.setBorder( YGEdgeEnd, yyGetReal(value));
			break;
		case "borderHorizontal":
			_node.setBorder( YGEdgeHorizontal, yyGetReal(value));
			break;
		case "borderVertical":
			_node.setBorder( YGEdgeVertical, yyGetReal(value));
			break;
		case "borderWidth":
		case "border":
			_node.setBorder( YGEdgeAll, yyGetReal(value));
			break;
		case "left":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "right":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "top":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "bottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "start":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "end":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "horizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "vertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVetical, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "position":
		case "positionType":
			_node.setPositionType( FLEXPANEL_StringToEnum(g_positionType, value) );
			break;
		case "minWidth":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMinWidth(v) }, function( n, v ) { n.setMinWidthPercent(v) }, undefined );
			break;
		case "maxWidth":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMaxWidth(v) }, function( n, v ) { n.setMaxWidthPercent(v) }, undefined );
			break;
		case "minHeight":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMinHeight(v) }, function( n, v ) { n.setMinHeightPercent(v) }, undefined );
			break;
		case "maxHeight":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMaxHeight(v) }, function( n, v ) { n.setMaxHeightPercent(v) }, undefined );
			break;
		case "width":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setWidth(v) }, function( n, v ) { n.setWidthPercent(v) }, function( n, v ) { n.setWidthAuto() } );
			break;
		case "height":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setHeight(v) }, function( n, v ) { n.setHeightPercent(v) }, function( n, v ) { n.setHeightAuto() } );
			break;
		case "name":
			FLEXPANEL_GetContext(_node).name = value;
			break;
		case "data":
			FLEXPANEL_GetContext(_node).data = value;
			break;
		case "layerElements":
			layerElements = value;
			break;
		case "__yyIsGMLObject":
		case "__type": break;
		default:
			//console.log( "flexpanel_create_node : unknown struct key " + key );
			break;
		}
	}

	if(layerElements !== undefined)
	{
		context.elements = [];

		for(var i = 0; i < layerElements.length; ++i)
		{
			var element_data = layerElements[i];

			if(element_data === undefined)
			{
				continue;
			}

			if(element_data.type === "Instance")
			{
				context.elements.push(new UILayerInstanceElement(element_data, true));
			}
			else if(element_data.type === "Sequence")
			{
				context.elements.push(new UILayerSequenceElement(element_data, true));
			}
			else if(element_data.type === "Sprite")
			{
				context.elements.push(new UILayerSpriteElement(element_data, true));
			}
			else if(element_data.type === "Text")
			{
				context.elements.push(new UILayerTextElement(element_data, true));
			}
		}
	}
}

// #######################################################################################
function FLEXPANEL_Handle_Struct( _node, _struct)
{
	var s = _struct;
	if (typeof(_struct) != "object") {
		s = json_parse(_struct)
	} // end if

	FLEXPANEL_Init_From_Struct(_node, s );
}


// #######################################################################################
function flexpanel_create_node( _struct )
{	
	var ret = g_yoga[ "Node" ]["createDefault"]();
	FLEXPANEL_CreateContext(ret);
	FLEXPANEL_Handle_Struct( ret, _struct);
	return ret;
}

// #######################################################################################
function flexpanel_delete_node( _node )
{	
	g_yoga["Node"]["destroy"](_node);
}

// #######################################################################################
function flexpanel_node_insert_child( _node, _child, _index)
{	
	_node.insertChild( _child, _index );
}

// #######################################################################################
function flexpanel_node_remove_child( _node, _child )
{
	_node.removeChild(_child);
}

// #######################################################################################
function flexpanel_node_remove_all_children( _node )
{	
	while( _node.getChildCount() ) {
		_node.removeChild( _node.getChild(0) );
	} // end while
}

// #######################################################################################
function flexpanel_node_get_num_children( _node )
{	
	return _node.getChildCount();
}

// #######################################################################################
function FLEXPANEL_Find_Child(_node, _name)
{
	var ret = undefined;
	var context = FLEXPANEL_GetContext(_node);
	if (context.name == _name) {
		ret = _node;
	}

	if (ret == undefined) {
		var numChildren = _node.getChildCount();
		for( var n=0; (ret == undefined) && (n<numChildren); ++n) {
			var child = _node.getChild(n);
			ret = FLEXPANEL_Find_Child(child, _name);
		} // end for
	}
	return ret;
}

// #######################################################################################
function flexpanel_node_get_child( _node, _indexOrString )
{	
	if (typeof(_indexOrString) == "string") {
		return FLEXPANEL_Find_Child( _node, _indexOrString );
	} // end if
	else {
		_indexOrString = yyGetReal(_indexOrString);
		return _node.getChild( _indexOrString );
	}
}

// #######################################################################################
function flexpanel_node_get_child_hash( _node, _indexOrString ) { return flexpanel_node_get_child(_node, _indexOrString ); }

// #######################################################################################
function flexpanel_node_get_parent( _node )
{
	return 	_node.getParent();
}

// #######################################################################################
function flexpanel_node_get_name( _node )
{	
	var context = FLEXPANEL_GetContext(_node);
	return context.name;
}

// #######################################################################################
function flexpanel_node_set_name( _node, _name )
{	
	var context = FLEXPANEL_GetContext(_node);
	context.name = _name;
}

// #######################################################################################
function flexpanel_node_get_data( _node )
{	
	var context = FLEXPANEL_GetContext(_node);
	if (context.data == undefined) {

		context.data = new GMLObject();

	} // end if
	return context.data;
}

// #######################################################################################
function flexpanel_node_set_data( _node, _data )
{	
	var context = FLEXPANEL_GetContext(_node);
	context.data = _data;
}

// #######################################################################################
function FLEXPANEL_EnumToString(_enum, _value)
{
	var ret = undefined;
	for( var key in _enum) {
		if (!_enum.hasOwnProperty(key)) continue;

		var value = _enum[key];
		if (value == _value) {
			ret = key;
			break;
		} // end if
	} // end for
	return ret;
}

// #######################################################################################
function FLEXPANEL_SetIfNotDefault( _ret, _name, _value, _default, _enum)
{
	if (_default != "isnan" ? (_value != _default) : !isNaN(_value)) {
		if (_enum != undefined) {
			// convert the number to a string
			_value = FLEXPANEL_EnumToString( _enum, _value );
		} // end if
	    variable_struct_set(_ret, _name, _value);
	}
}

// #######################################################################################
function FLEXPANEL_SetIfNotDefaultV( _ret, _name, _value, _default)
{
	if (_value == undefined) return;
	if (_default != "isnan" ? (_value.value != _default) : !isNaN(_value.value)) {
		switch( _value.unit )
		{
		case YGUnitPoint:
	    	variable_struct_set(_ret, _name, _value.value);
	    	break;
		case YGUnitAuto:
	    	variable_struct_set(_ret, _name, "auto");
	    	break;
		case YGUnitPercent:
	    	variable_struct_set(_ret, _name, _value.value+"%");
	    	break;
		} // end swiutch
	}
}

// #######################################################################################
function flexpanel_node_get_struct( _node )
{
	var ret = {};
    ret.__yyIsGMLObject = true;	
	var context = FLEXPANEL_GetContext(_node);
    FLEXPANEL_SetIfNotDefault( ret, "alignContent", _node.getAlignContent(), YGAlignFlexStart );
    FLEXPANEL_SetIfNotDefault( ret, "alignItems", _node.getAlignItems(), YGAlignStretch, g_alignType );
    FLEXPANEL_SetIfNotDefault( ret, "alignSelf", _node.getAlignSelf(), YGAlignAuto );
    FLEXPANEL_SetIfNotDefault( ret, "aspectRatio", _node.getAspectRatio(), "isnan" );
    FLEXPANEL_SetIfNotDefault( ret, "display", _node.getDisplay(), YGDisplayFlex, g_displayType  );
    FLEXPANEL_SetIfNotDefault( ret, "flex", context.flex, undefined  );
    FLEXPANEL_SetIfNotDefault( ret, "flexGrow", _node.getFlexGrow(), 0  );
    FLEXPANEL_SetIfNotDefault( ret, "flexShrink", _node.getFlexShrink(), 0  );
    FLEXPANEL_SetIfNotDefault( ret, "flexBasis", _node.getFlexBasis(), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "flexDirection", _node.getFlexDirection(), YGFlexDirectionColumn, g_flexDirectionType  );
    FLEXPANEL_SetIfNotDefault( ret, "flexWrap", _node.getFlexWrap(), YGWrapNoWrap, g_wrapType  );
    FLEXPANEL_SetIfNotDefault( ret, "gapColumn", _node.getGap( YGGutterColumn ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "gapRow", _node.getGap( YGGutterRow ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "gap", _node.getGap( YGGutterAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "justifyContent", _node.getJustifyContent(), YGJustifyFlexStart, g_justifyType  );
    FLEXPANEL_SetIfNotDefault( ret, "direction", context.direction, undefined, g_directionType  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginLeft", _node.getMargin( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginRight", _node.getMargin( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginTop", _node.getMargin( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginBottom", _node.getMargin( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginStart", _node.getMargin( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginEnd", _node.getMargin( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginHorizontal", _node.getMargin( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginVertical", _node.getMargin( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "margin", _node.getMargin( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingLeft", _node.getPadding( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingRight", _node.getPadding( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingTop", _node.getPadding( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingBottom", _node.getPadding( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingStart", _node.getPadding( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingEnd", _node.getPadding( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingHorizontal", _node.getPadding( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingVertical", _node.getPadding( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "padding", _node.getPadding( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderLeft", _node.getBorder( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderRight", _node.getBorder( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderTop", _node.getBorder( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderBottom", _node.getBorder( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderStart", _node.getBorder( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderEnd", _node.getBorder( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderHorizontal", _node.getBorder( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderVertical", _node.getBorder( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "border", _node.getBorder( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "left", _node.getPosition( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "right", _node.getPosition( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "top", _node.getPosition( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "bottom", _node.getPosition( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "start", _node.getPosition( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "end", _node.getPosition( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "horizontal", _node.getPosition( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "vertical", _node.getPosition( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "positionType", _node.getPositionType(), YGPositionTypeRelative, g_positionType  );
    FLEXPANEL_SetIfNotDefaultV( ret, "minWidth", _node.getMinWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "maxWidth", _node.getMaxWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "minHeight", _node.getMinHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "maxHeight", _node.getMaxHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "width", _node.getWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "height", _node.getHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "name", context.name, undefined  );
    FLEXPANEL_SetIfNotDefault( ret, "data", context.data, undefined  );

	var numChildren = _node.getChildCount();
	if (numChildren > 0) {
		var nodes = new Array(numChildren);
		for( var n=0; n<numChildren; ++n) {
			var child = _node.getChild(n);
			var childStruct = flexpanel_node_get_struct(child);
			nodes[n] = childStruct;
		} // end for
    	variable_struct_set(ret, "nodes", nodes);		
	} // end if

    return ret;
}

// #######################################################################################
function flexpanel_calculate_layout( _node, _width, _height, _direction)
{	
	_node.calculateLayout( yyGetReal(_width), yyGetReal(_height), _direction );
}

// #######################################################################################
function flexpanel_node_layout_get_position( _node, _relative )
{	
	var x = 0;
	var y = 0;
	_relative ??= true;
	_relative = yyGetBool(_relative);
	if (!_relative) {
		var curr = _node.getParent();
		while( curr != undefined ) {

			x += curr.getComputedLeft();
			y += curr.getComputedTop();

			curr = curr.getParent();
		} // end while
	} // end if
	var ret = {};
    ret.__yyIsGMLObject = true;	
    var left = _node.getComputedLeft();
    var right = _node.getComputedRight();
    var bottom = _node.getComputedBottom();
    var top = _node.getComputedTop();
    var width = _node.getComputedWidth();
    var height = _node.getComputedHeight();
    variable_struct_set(ret, "left", left + x);
    variable_struct_set(ret, "top", top + y);
    variable_struct_set(ret, "width", width);
    variable_struct_set(ret, "height", height);
    variable_struct_set(ret, "bottom", bottom + y);
    variable_struct_set(ret, "right", right + x);

	return ret;
}

// #######################################################################################
function FLEXPANEL_CreateValueResult( _v )
{
	var ret = {};
    ret.__yyIsGMLObject = true;	
    variable_struct_set(ret, "unit", _v.unit);
    variable_struct_set(ret, "value", _v.value);
}


// #######################################################################################
function flexpanel_node_style_get_align_content(_node) 
{
	return _node.getAlignContent();
}

// #######################################################################################
function flexpanel_node_style_get_align_items( _node )
{
	return _node.getAlignItems();
}

// #######################################################################################
function flexpanel_node_style_get_align_self(_node )
{
	return _node.getAlignSelf();
}

// #######################################################################################
function flexpanel_node_style_get_aspect_ratio( _node )
{
	return _node.getAspecRatio();
}

// #######################################################################################
function flexpanel_node_style_get_display( _node )
{
	return _node.getDisplay();
}

// #######################################################################################
function flexpanel_node_style_get_flex( _node )
{
	var context = FLEXPANEL_GetContext(_node);
	return context.flex;
}

// #######################################################################################
function flexpanel_node_style_get_flex_grow( _node )
{
	return _node.getFlexGrow();
}

// #######################################################################################
function flexpanel_node_style_get_flex_shrink( _node )
{
	return _node.getFlexShrink();
}

// #######################################################################################
function flexpanel_node_style_get_flex_basis( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getFlexBasis());
}

// #######################################################################################
function flexpanel_node_style_get_flex_direction( _node )
{
	return _node.getFlexDirection();
}

// #######################################################################################
function flexpanel_node_style_get_flex_wrap( _node )
{
	return _node.getFlexWrap();
}

// #######################################################################################
function flexpanel_node_style_get_gap( _node, _gutter )
{
	return _node.getGap( _gutter );
}

// #######################################################################################
function flexpanel_node_style_get_position( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getPosition(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_justify_content( _node, _justify )
{
	return _node.getJustifyContent( _justify );
}

// #######################################################################################
function flexpanel_node_style_get_direction( _node )
{
	var context = FLEXPANEL_GetContext(_node);
	return context.direction;
}

// #######################################################################################
function flexpanel_node_style_get_margin( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getMargin(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_padding( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getPadding(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_border( _node, _edge )
{
	return _node.getBorder(_edge);
}

// #######################################################################################
function flexpanel_node_style_get_position_type( _node )
{
	return _node.getPositionType();
}

// #######################################################################################
function flexpanel_node_style_get_min_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMinWidth());
}

// #######################################################################################
function flexpanel_node_style_get_max_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMaxWidth());
}

// #######################################################################################
function flexpanel_node_style_get_min_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMinHeight());
}

// #######################################################################################
function flexpanel_node_style_get_max_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMaxHeight());
}

// #######################################################################################
function flexpanel_node_style_get_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getWidth());
}

// #######################################################################################
function flexpanel_node_style_get_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getHeight());
}

// #######################################################################################
function flexpanel_node_style_set_align_content(_node, _value)
{
	_node.setAlignContent( yyGetInt32(_value) )	;
}

// #######################################################################################
function flexpanel_node_style_set_align_items(_node, _value)
{	
	_node.setAlignItems( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_align_self(_node, _value)
{	
	_node.setAlignSelf( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_aspect_ratio(_node, _value)
{	
	_node.setAspectRatio(yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_display(_node, _value)
{	
	_node.setDisplay( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex(_node, _value)
{
	var context = FLEXPANEL_GetContext(_node);
	_value = yyGetReal(_value);
	_node.setFlex( _value );
	context.flex = _value;
}

// #######################################################################################
function flexpanel_node_style_set_flex_grow(_node, _value)
{	
	_node.setFlexGrow( yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_shrink(_node, _value)
{	
	_node.setFlexShrink( yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_basis(_node, _unit, _value)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setFlexBasisAuto();
		break;
	case YGUnitPoint:
		_node.setFlexBasis( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setFlexBasisPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_flex_direction(_node, _value)
{
	_node.setFlexDirection( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_wrap(_node, _value)
{	
	_node.setFlexWrap( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_gap(_node, _gutter, _value)
{
	_node.setGap( _gutter, yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_position(_node, _edge, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setPosition( _edge, yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setPositionPercent( _edge, yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_justify_content(_node, _value)
{
	_node.setJustifyContent( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_direction(_node, _value)
{	
	var context = FLEXPANEL_GetContext(_node);
	context.direction = yyGetInt32(_value);	
}

// #######################################################################################
function flexpanel_node_style_set_margin(_node, _edge, _value)
{	
	_node.setMargin( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_padding(_node, _edge, _value)
{	
	_node.setPadding( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_border(_node, _edge, _value)
{	
	_node.setBorder( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_position_type(_node, _value)
{	
	_node.setPositionType(yyGetInt32(_value));

}

// #######################################################################################
function flexpanel_node_style_set_min_width(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMinWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_width(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMaxWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_min_height(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMinHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_height(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMaxHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_width(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setWidthAuto();
		break;
	case YGUnitPoint:
		_node.setWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_height(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setHeightAuto();
		break;
	case YGUnitPoint:
		_node.setHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}
// @endif

function UILayers_Create()
{
	if(g_UILayers !== null)
	{
		return;
	}

	g_UILayers = [];

	for(var i = 0; i < g_pGMFile.GMUILayers.length; ++i)
	{
		var layer_data = g_pGMFile.GMUILayers[i];

		var layer_type;
		if(layer_data.drawSpace === "GUI")
		{
			layer_type = eLAYER_GUI_IN_GUI;
		}
		else if(layer_data.drawSpace === "VIEW")
		{
			layer_type = eLAYER_GUI_IN_VIEW;
		}

		var node = flexpanel_create_node(layer_data);
		var layer = g_pLayerManager.AddLayer(g_RunRoom, i, flexpanel_node_get_name(node), layer_type);
		layer.m_visible = layer_data.visible;

		g_UILayers.push({
			node: node,
			layer: layer,

			x_offset: 0.0,
			y_offset: 0.0,
		});

		UILayers_Create_node_elements(node, layer);
	}
}

function UILayers_Create_node_elements(node, layer)
{
	var context = FLEXPANEL_GetContext(node);

	for(var i = 0; i < context.elements.length; ++i)
	{
		var element = context.elements[i];
		element.create_element(layer);
	}

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Create_node_elements(child, layer);
	}
}

function UILayers_Layout(rect, gui_mask)
{
	for(var i = 0; i < g_UILayers.length; ++i)
	{
		var ui_layer = g_UILayers[i];

		if(!(ui_layer.layer.m_visible) || (ui_layer.layer.m_gui_layer & gui_mask) == 0)
		{
			continue;
		}

		/* Mark leaf nodes dirty so Yoga will rediscover their sizes. */
		UILayers_Layout_node_prepare(ui_layer.node);

		ui_layer.node.calculateLayout((rect.right - rect.left), (rect.bottom - rect.top), YGDirectionInherit); // TODO: layoutDirection parameter

		var offset_rect = new YYRECT();
		offset_rect.Copy(rect);

		offset_rect.left += ui_layer.x_offset;
		offset_rect.right += ui_layer.x_offset;

		offset_rect.top += ui_layer.y_offset;
		offset_rect.bottom += ui_layer.y_offset;

		UILayers_Layout_node_position(ui_layer.node, offset_rect, offset_rect, false);
	}
}

function UILayers_Layout_node_prepare(node)
{
	var is_leaf_node = true;

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Layout_node_prepare(child);

		is_leaf_node = false;
	}

	/* We only supply a measure function for nodes which contain no nested flex panels. */
	if (is_leaf_node)
	{
		// TODO: Can we rely on g_yoga in global scope to only define this once?
		var UILayers_MeasureCallbackWrapper = g_yoga.MeasureCallback.extend("MeasureCallback", {
			__construct: function(node) {
				this.__parent.__construct.call(this);
				this.node = node;
			},

			measure: function(width, widthMode, height, heightMode)
			{
				return UILayers_Layout_measure_node(this.node, width, widthMode, height, heightMode);
			},
		});

		node.setMeasureFunc(new UILayers_MeasureCallbackWrapper(node));
		node.markDirty();
	}
	else {
		node.unsetMeasureFunc();
	}
}

function UILayers_Layout_measure_node(node, width, widthMode, height, heightMode)
{
	var context = FLEXPANEL_GetContext(node);

	var max_width_constraint;
	var max_height_constraint;

	switch (widthMode)
	{
	case YGMeasureModeUndefined:
		max_width_constraint = Number.MAX_VALUE;
		break;

	case YGMeasureModeAtMost:
	case YGMeasureModeExactly:
		max_width_constraint = width;
		break;
	}

	switch (heightMode)
	{
	case YGMeasureModeUndefined:
		max_height_constraint = Number.MAX_VALUE;
		break;

	case YGMeasureModeAtMost:
	case YGMeasureModeExactly:
		max_height_constraint = height;
		break;
	}

	var max_w = 0.0;
	var max_h = 0.0;

	for (var i = 0; i < context.elements.length; ++i)
	{
		var item_size = context.elements[i].measure_item(this, max_width_constraint, max_height_constraint);

		max_w = Math.max(max_w, item_size.width);
		max_h = Math.max(max_h, item_size.height);
	}

	var computed_size = { width: undefined, height: undefined };

	switch (widthMode)
	{
		case YGMeasureModeUndefined:
			computed_size.width = max_w;
			break;

		case YGMeasureModeAtMost:
			computed_size.width = Math.min(max_w, width);
			break;

		case YGMeasureModeExactly:
			computed_size.width = width;
			break;
	}

	switch (heightMode)
	{
	case YGMeasureModeUndefined:
		computed_size.height = max_h;
		break;

	case YGMeasureModeAtMost:
		computed_size.height = Math.min(max_h, height);
		break;

	case YGMeasureModeExactly:
		computed_size.height = height;
		break;
	}

	return computed_size;
}

function UILayers_Layout_node_position(node, outer_container, clipping_rect, set_clipping_rect)
{
	var context = FLEXPANEL_GetContext(node);

	/* Get our bounding box relative to our parent container. */
	var local_x = node.getComputedLeft();
	var local_y = node.getComputedTop();
	var local_w = node.getComputedWidth();
	var local_h = node.getComputedHeight();

	var container = new YYRECT();
	container.left = outer_container.left + local_x;
	container.top = outer_container.top + local_y;
	container.right = container.left + local_w - 1.0;
	container.bottom = container.top + local_h - 1.0;

	var container_clip = context.clip_content
		? YYRECT.Intersection(container, clipping_rect)
		: clipping_rect;

	if(context.clip_content)
	{
		set_clipping_rect = true;
	}

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Layout_node_position(child, container, container_clip, set_clipping_rect);
	}

	for(var i = 0; i < context.elements.length; ++i)
	{
		var element = context.elements[i];
		element.position(container, container_clip, set_clipping_rect);
	}
}

function UILayers_stretch_element(element_size, container_size, stretch_width, stretch_height, preserve_aspect)
{
	var aspect = element_size[0] / element_size[1];

	var stretched_width = element_size[0];
	var stretched_height = element_size[1];

	if (stretch_width)
	{
		stretched_width = container_size[0];
	}

	if (stretch_height)
	{
		stretched_height = container_size[1];
	}

	if (preserve_aspect)
	{
		var corrected_width = stretched_height * aspect;
		var corrected_height = stretched_width / aspect;

		if (stretch_height && stretch_width)
		{
			if (corrected_width < stretched_width)
			{
				stretched_width = corrected_width;
			}
			else {
				stretched_height = corrected_height;
			}
		}
		else if(stretch_width)
		{
			stretched_height = corrected_height;
		}
		else if (stretch_height)
		{
			stretched_width = corrected_width;
		}
	}

	return [ stretched_width, stretched_height ];
}

function UILayers_translate_element_position(container, x, y, anchor)
{
	var origin_x = 0.0;
	var origin_y = 0.0;

	switch (anchor)
	{
	case "TopLeft":
	case "MiddleLeft":
	case "BottomLeft":
		origin_x = container.left;
		break;

	case "TopCentre":
	case "MiddleCentre":
	case "BottomCentre":
	{
		var container_w = container.right - container.left + 1.0;
		origin_x = container.left + (container_w / 2.0);
		break;
	}

	case "TopRight":
	case "MiddleRight":
	case "BottomRight":
		origin_x = container.right;
		break;

	default:
		break;
	}

	switch (anchor)
	{
	case "TopLeft":
	case "TopCentre":
	case "TopRight":
		origin_y = container.top;
		break;

	case "MiddleLeft":
	case "MiddleCentre":
	case "MiddleRight":
	{
		var container_h = container.bottom - container.top + 1.0;
		origin_y = container.top + (container_h / 2.0);
		break;
	}

	case "BottomLeft":
	case "BottomCentre":
	case "BottomRight":
		origin_y = container.bottom;
		break;

	default:
		break;
	}

	var translated_x = origin_x + x;
	var translated_y = origin_y + y;

	return [ translated_x, translated_y ];
}

var g_UILayerInstanceElementsFromWAD = {};

function UILayerInstanceElement(element_data, from_wad)
{
	this.elementOrder        = element_data.elementOrder;
	this.instanceObjectIndex = element_data.instanceObjectIndex;
	this.instanceVariables   = element_data.instanceVariables;
	this.instanceOffsetX     = element_data.instanceOffsetX;
	this.instanceOffsetY     = element_data.instanceOffsetY;
	this.instanceScaleX      = element_data.instanceScaleX;
	this.instanceScaleY      = element_data.instanceScaleY;
	this.instanceImageSpeed  = element_data.instanceImageSpeed;
	this.instanceImageIndex  = element_data.instanceImageIndex;
	this.instanceColour      = element_data.instanceColour;
	this.instanceAngle       = element_data.instanceAngle;

	if(from_wad)
	{
		this.instanceId          = element_data.instanceId;
		this.instanceCreate      = element_data.instanceCreate;
		this.instancePreCreate   = element_data.instancePreCreate;

		g_UILayerInstanceElementsFromWAD[this.instanceId] = this;
	}
	else{
		this.instanceId          = undefined;
		this.instanceCreate      = undefined;
		this.instancePreCreate   = undefined;
	}

	this.flexVisible    = element_data.flexVisible;
	this.flexAnchor     = element_data.flexAnchor;
	this.stretchWidth   = element_data.stretchWidth;
	this.stretchHeight  = element_data.stretchHeight;
	this.keepAspect     = element_data.keepAspect;

	this.m_element_id = undefined;
}

UILayerInstanceElement.prototype.create_element = function(target_layer)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Instances created from the WAD have a fixed ID, ones created from a GML structure get the
	 * next free one as if created by instance_create_depth() etc.
	*/
	var new_instance_id = this.instanceId !== undefined
		? this.instanceId
		: room_maxid++;

	var instance = new yyInstance(0.0, 0.0, new_instance_id, this.instanceObjectIndex, true);
	instance.createdone = false;

	// TODO: Variables

	// pI->SetInitCode(Code_GetEntry(m_params.m_init_code_slot));
	// pI->SetPreCreateCode(Code_GetEntry(m_params.m_pre_create_code_slot));
	instance.image_xscale = this.instanceScaleX;
	instance.image_yscale = this.instanceScaleY;
	instance.image_speed = this.instanceImageSpeed;
	instance.image_index = this.instanceImageIndex;
	instance.sequence_pos = instance.last_sequence_pos = this.instanceImageIndex;
	instance.image_blend = ConvertGMColour(this.instanceColour & 0xffffff);
	instance.image_alpha = ((this.instanceColour >> 24) & 0xff) / 255.0;
	instance.image_angle = this.instanceAngle;
	// Current_Object = pI->GetObjectIndex();
	// pI->CreatePhysicsBody(Run_Room);

	if (this.stretchWidth || this.stretchHeight)
	{
		instance.image_angle = 0.0;
	}

	instance.SetOnUILayer(true);

	this.m_element_id = g_pLayerManager.AddInstanceToLayer(g_RunRoom, target_layer, instance);

	g_RunRoom.m_Active.Add(instance);
	g_pInstanceManager.Add(instance);
};

UILayerInstanceElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var instance = element.m_pInstance;

		var translated_position = UILayers_translate_element_position(container, this.instanceOffsetX, this.instanceOffsetY, this.flexAnchor);

		instance.x = translated_position[0];
		instance.y = translated_position[1];

		instance.Maybe_Compute_BoundingBox();

		/* Size of the instance with no scaling applied. */
		var base_size = [
			((instance.bbox.right - instance.bbox.left) / instance.image_xscale),
			((instance.bbox.bottom - instance.bbox.top) / instance.image_yscale),
		];

		/* Size of the instance with scaling from the flexpanel element properties applied. */
		var stretched_base_size = [
			(base_size[0] * this.instanceScaleX),
			(base_size[1] * this.instanceScaleY),
		];

		/* Size of the flexpanel to fit within. */
		var container_size = [
			(container.right - container.left),
			(container.bottom - container.top),
		];

		/* Calculate the desired width/height of the instance. */
		var stretched_size = UILayers_stretch_element(stretched_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

		/* Derive the scales to get the instance to the desired size. */
		instance.image_xscale = stretched_size[0] / base_size[0];
		instance.image_yscale = stretched_size[1] / base_size[1];

		// TODO: Clipping
	}
};

UILayerInstanceElement.prototype.measure_item = function(node, max_width, max_height)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return { width: 0.0, height: 0.0 };
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var instance = element.m_pInstance;

		instance.Maybe_Compute_BoundingBox();

		return {
			width: (((instance.bbox.right - instance.bbox.left) / instance.image_xscale) * this.instanceScaleX),
			height: (((instance.bbox.bottom - instance.bbox.top) / instance.image_yscale) * this.instanceScaleY),
		};
	}
	else{
		return { width: 0.0, height: 0.0 };
	}
};

function UILayerSequenceElement(element_data, from_wad)
{
	this.elementOrder         = element_data.elementOrder;
	this.sequenceIndex        = element_data.sequenceIndex;
	this.sequenceOffsetX      = element_data.sequenceOffsetX;
	this.sequenceOffsetY      = element_data.sequenceOffsetY;
	this.sequenceScaleX       = element_data.sequenceScaleX;
	this.sequenceScaleY       = element_data.sequenceScaleY;
	this.sequenceColour       = element_data.sequenceColour;
	this.sequenceImageSpeed   = element_data.sequenceImageSpeed;
	this.sequenceSpeedType    = element_data.sequenceSpeedType;
	this.sequenceHeadPosition = element_data.sequenceHeadPosition;
	this.sequenceAngle        = element_data.sequenceAngle;
	this.sequenceName         = from_wad ? element_data.sequenceName : undefined;

	this.flexVisible    = element_data.flexVisible;
	this.flexAnchor     = element_data.flexAnchor;
	this.stretchWidth   = element_data.stretchWidth;
	this.stretchHeight  = element_data.stretchHeight;
	this.tileHorizontal = element_data.tileHorizontal;
	this.tileVertical   = element_data.tileVertical;
	this.keepAspect     = element_data.keepAspect;

	this.m_element_id = undefined;
}

UILayerSequenceElement.prototype.create_element = function(target_layer)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewSequence = new CLayerSequenceElement();

	NewSequence.m_sequenceIndex = this.sequenceIndex;
	NewSequence.m_headPosition = this.sequenceHeadPosition;
	NewSequence.m_imageBlend = ConvertGMColour(this.sequenceColour & 0xffffff);
	NewSequence.m_imageAlpha = ((this.sequenceColour >> 24) & 0xff) / 255.0;
	NewSequence.m_angle = this.sequenceAngle;
	NewSequence.m_imageSpeed = this.sequenceImageSpeed;
	NewSequence.m_playbackSpeedType = this.sequenceSpeedType;

	if(this.sequenceName !== undefined)
	{
		NewSequence.m_name = this.sequenceName;
	}

	if (this.stretchWidth || this.stretchHeight)
	{
		NewSequence.m_angle = 0.0;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewSequence, true);
};

UILayerSequenceElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.sequenceOffsetX, this.sequenceOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		var sequence = g_pSequenceManager.GetSequenceFromID(this.sequenceIndex);

		if(sequence !== undefined && sequence.m_width !== undefined && sequence.m_height !== undefined)
		{
			/* Size of the sequence with no scaling applied. */
			var base_size = [
				sequence.m_width,
				sequence.m_height,
			];

			/* Size of the sequence with scaling from the flexpanel element properties applied. */
			var scaled_base_size = [
				(base_size[0] * this.sequenceScaleX),
				(base_size[1] * this.sequenceScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left),
				(container.bottom - container.top),
			];

			/* Calculate the desired width/height of the sequence. */
			var stretched_size = UILayers_stretch_element(scaled_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			/* Derive the scales to get the sequence to the desired size. */
			element.m_scaleX = stretched_size[0] / base_size[0];
			element.m_scaleY = stretched_size[1] / base_size[1];
		}

		// TODO: Clipping
	}
};

UILayerSequenceElement.prototype.measure_item = function(node, max_width, max_height)
{
	var sequence = g_pSequenceManager.GetSequenceFromID(this.sequenceIndex);

	if(sequence !== undefined && sequence.m_width !== undefined && sequence.m_height !== undefined)
	{
		/* Sequence width/height (at t=0) is calculated by the IDE for us. */
		return { width: sequence.m_width, height: sequence.m_height };
	}

	return { width: 0.0, height: 0.0 };
};

function UILayerSpriteElement(element_data, from_wad)
{
	this.elementOrder     = element_data.elementOrder;
	this.spriteIndex      = element_data.spriteIndex;
	this.spriteOffsetX    = element_data.spriteOffsetX;
	this.spriteOffsetY    = element_data.spriteOffsetY;
	this.spriteScaleX     = element_data.spriteScaleX;
	this.spriteScaleY     = element_data.spriteScaleY;
	this.spriteColour     = element_data.spriteColour;
	this.spriteImageSpeed = element_data.spriteImageSpeed;
	this.spriteSpeedType  = element_data.spriteSpeedType;
	this.spriteImageIndex = element_data.spriteImageIndex;
	this.spriteAngle      = element_data.spriteAngle;
	this.spriteName       = from_wad ? element_data.spriteName : undefined;

	this.flexVisible    = element_data.flexVisible;
	this.flexAnchor     = element_data.flexAnchor;
	this.stretchWidth   = element_data.stretchWidth;
	this.stretchHeight  = element_data.stretchHeight;
	this.tileHorizontal = element_data.tileHorizontal;
	this.tileVertical   = element_data.tileVertical;
	this.keepAspect     = element_data.keepAspect;

	this.m_element_id = undefined;
}

UILayerSpriteElement.prototype.create_element = function(target_layer)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewSprite = new CLayerSpriteElement();
	NewSprite.m_spriteIndex = this.spriteIndex;
	NewSprite.m_sequencePos = this.spriteImageIndex;
	NewSprite.m_sequenceDir = 1.0;

	NewSprite.m_imageSpeed = this.spriteImageSpeed;
	NewSprite.m_playbackspeedtype = this.spriteSpeedType;
	NewSprite.m_imageIndex = this.spriteImageIndex;
	NewSprite.m_imageScaleX = this.spriteScaleX;
	NewSprite.m_imageScaleY = this.spriteScaleY;
	NewSprite.m_imageAngle = this.spriteAngle;
	NewSprite.m_imageBlend = ConvertGMColour(this.spriteColour & 0xffffff);
	NewSprite.m_imageAlpha = ((this.spriteColour >> 24)&0xff) / 255.0;

	if(this.spriteName !== undefined)
	{
		NewSprite.m_name = this.spriteName;
	}

	if (this.stretchWidth || this.stretchHeight)
	{
		NewSprite.m_imageAngle = 0.0;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewSprite, true);
};

UILayerSpriteElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.spriteOffsetX, this.spriteOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		var sprite = g_pSpriteManager.Get(element.m_spriteIndex);
		if(sprite !== null)
		{
			/* Size of the sprite with no scaling applied. */
			var base_size = [
				sprite.GetWidth(),
				sprite.GetHeight(),
			];

			/* Size of the sprite with scaling from the flexpanel element properties applied. */
			var stretched_base_size = [
				(base_size[0] * this.spriteScaleX),
				(base_size[1] * this.spriteScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left),
				(container.bottom - container.top),
			];

			/* Calculate the desired width/height of the sprite. */
			var stretched_size = UILayers_stretch_element(stretched_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			/* Derive the scales to get the sprite to the desired size. */
			element.m_imageScaleX = stretched_size[0] / base_size[0];
			element.m_imageScaleY = stretched_size[1] / base_size[1];
		}

		// TODO: Tiling
		// TODO: Clipping
	}
};

UILayerSpriteElement.prototype.measure_item = function(node, max_width, max_height)
{
	var sprite = g_pSpriteManager.Get(this.spriteIndex);

	if(sprite !== null)
	{
		/* Get the size of the base sprite, applying the scale of the layer element. */
		var sprite_width = sprite.GetWidth() * this.spriteScaleX;
		var sprite_height = sprite.GetHeight() * this.spriteScaleY;

		/* Skip rotation if angle is zero. */
		if(Math.abs(this.spriteAngle) > g_GMLMathEpsilon)
		{
			/* Rotate each corner around the scaled origin to get the total bounds of the sprite with rotation. */

			var scaled_origin_x = sprite.GetXOrigin() * this.spriteScaleX;
			var scaled_origin_y = sprite.GetYOrigin() * this.spriteScaleY;

			var p1 = [ 0.0, 0.0 ];
			var p2 = [ sprite_width, 0.0 ];
			var p3 = [ 0.0, sprite_height ];
			var p4 = [ sprite_width, sprite_height ];

			var rot_matrix = new yyRotationMatrix(-this.spriteAngle);

			p1 = RotatePointAroundOrigin(p1, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p2 = RotatePointAroundOrigin(p2, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p3 = RotatePointAroundOrigin(p3, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p4 = RotatePointAroundOrigin(p4, [ scaled_origin_x, scaled_origin_y ], rot_matrix);

			/* Use the min/max points to make a bounding rect of the rotated sprite. */

			var extent_left = Math.min(p1[0], Math.min(p2[0], Math.min(p3[0], p4[0])));
			var extent_top = Math.min(p1[1], Math.min(p2[1], Math.min(p3[1], p4[1])));
			var extent_right = Math.max(p1[0], Math.max(p2[0], Math.max(p3[0], p4[0])));
			var extent_bottom = Math.max(p1[1], Math.max(p2[1], Math.max(p3[1], p4[1])));

			sprite_width = (extent_right - extent_left) + 1.0;
			sprite_height = (extent_bottom - extent_top) + 1.0;
		}

		return { width: sprite_width, height: sprite_height };
	}
	else{
		return { width: 0.0, height: 0.0 };
	}
};

function UILayerTextElement(element_data, from_wad)
{
	this.elementOrder         = element_data.elementOrder;
	this.textFontIndex        = element_data.textFontIndex;
	this.textOffsetX          = element_data.textOffsetX;
	this.textOffsetY          = element_data.textOffsetY;
	this.textScaleX           = element_data.textScaleX;
	this.textScaleY           = element_data.textScaleY;
	this.textAngle            = element_data.textAngle;
	this.textColour           = element_data.textColour;
	this.textOriginX          = element_data.textOriginX;
	this.textOriginY          = element_data.textOriginY;
	this.textText             = element_data.textText;
	this.textAlignment        = element_data.textAlignment;
	this.textCharacterSpacing = element_data.textCharacterSpacing;
	this.textLineSpacing      = element_data.textLineSpacing;
	this.textFrameWidth       = element_data.textFrameWidth;
	this.textFrameHeight      = element_data.textFrameHeight;
	this.textWrap             = element_data.textWrap;
	this.textName             = element_data.textName;

	this.flexVisible    = element_data.flexVisible;
	this.flexAnchor     = element_data.flexAnchor;
	this.stretchWidth   = element_data.stretchWidth;
	this.stretchHeight  = element_data.stretchHeight;
	this.keepAspect     = element_data.keepAspect;

	this.m_element_id = undefined;
}

UILayerTextElement.prototype.create_element = function(target_layer)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewTextItem = new CLayerTextElement();
	NewTextItem.m_fontIndex = this.textFontIndex;
	NewTextItem.m_angle = this.textAngle;
	NewTextItem.m_blend = ConvertGMColour(this.textColour & 0xffffff);
	NewTextItem.m_alpha = ((this.textColour >> 24) & 0xff) / 255.0;
	NewTextItem.m_originX = this.textOriginX;
	NewTextItem.m_originY = this.textOffsetY;
	NewTextItem.m_text = this.textText;
	NewTextItem.m_alignment = this.textAlignment;
	NewTextItem.m_charSpacing = this.textCharacterSpacing;
	NewTextItem.m_lineSpacing = this.textLineSpacing;
	NewTextItem.m_frameW = this.textFrameWidth;
	NewTextItem.m_frameH = this.textFrameHeight;
	NewTextItem.m_wrap = this.textWrap;

	if(this.textName !== undefined)
	{
		NewTextItem.m_name = this.textName;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewTextItem, true);
};

UILayerTextElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	var font = g_pFontManager.Get(this.textFontIndex);

	if(element !== null && font !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.textOffsetX, this.textOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		element.m_scaleX = this.textScaleX;
		element.m_scaleY = this.textScaleY;

		if(!(element.m_wrap) && (this.stretchWidth || this.stretchHeight))
		{
			var base_text_size = this._calc_base_text_size(element, font, (container.right - container.left));

			/* Size of the text with scaling from the flexpanel element properties applied. */
			var scaled_text_size = [
				(base_text_size.width * this.textScaleX),
				(base_text_size.height * this.textScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left),
				(container.bottom - container.top),
			];

			/* Calculate the desired width/height of the text. */
			var stretched_size = UILayers_stretch_element(scaled_text_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			if (this.stretchWidth || this.keepAspect)
			{
				element.m_scaleX = stretched_size[0] / base_text_size.width;
			}

			if (this.stretchHeight || this.keepAspect)
			{
				element.m_scaleY = (stretched_size[1] * this.textScaleY) / base_text_size.height;
			}
		}

		if(this.stretchWidth)
		{
			element.m_frameW = (container.right - container.left) / element.m_scaleX;
		}
		else{
			element.m_frameW = this.textFrameWidth;
		}

		if(this.stretchHeight)
		{
			element.m_frameH = (container.bottom - container.top) / element.m_scaleY;
		}
		else{
			element.m_frameH = this.textFrameHeight;
		}

		// TODO: Clipping
	}
};

UILayerTextElement.prototype.measure_item = function(node, max_width, max_height)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return { width: 0, height: 0 };
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	var font = g_pFontManager.Get(this.textFontIndex);

	if(element === null || font === null)
	{
		return { width: 0, height: 0 };
	}

	var size = this._calc_base_text_size(element, font, max_width);

	/* When stretch and keep aspect is enabled, we allow the text to grow to fit a fixed-size
	 * container in one dimension and then grow the other (auto sized) dimension to fit via the
	 * measure function...
	 *
	 * This logic is copied from RoomItemHelper.MeasureItemSize() in the IDE.
	*/

	if ((!element.m_wrap) && this.keepAspect && (this.stretchWidth || this.stretchHeight))
	{
		var node_width = node.GetWidth();
		var node_height = node.GetHeight();

		var autoW = node_width.unit == YGUnitAuto;
		var autoH = node_height.unit == YGUnitAuto;
		var parentW = (autoW) ? size.width : max_width; //parent width = item width, when auto sized
		var parentH = (autoH) ? size.height : max_height;
		var contentAspect = size.width / size.height;
		var adjustHeight = true;
		if (autoW && autoH)
		{
			var parentAspect = parentW / parentH; //parent size = item size in both dimensions
			adjustHeight = (contentAspect > parentAspect);
		}
		else if (autoW)
		{
			size.width = Math.abs(max_height * contentAspect); //we cannot adjust fixed height
		}
		else if (autoH)
		{
			size.height = Math.abs(max_width / contentAspect); //we cannot adjust fixed width
		}

		if (adjustHeight)
			size.height = Math.abs(parentW / contentAspect);
		else
			size.width = Math.abs(parentH * contentAspect);
	}

	return size;
};

UILayerTextElement.prototype._calc_base_text_size = function(element, font, max_container_width)
{
	var old_font = g_pFontManager.fontid;
	g_pFontManager.fontid = this.textFontIndex;

	/* The "linesep" parameter to yyFontManager.GR_Text_Sizes() is actually the pitch
	 * (i.e. height + line spacing) to add for each line after the first line, so we need to
	 * grab the font and copy what it does to calculate that correctly.
	*/
	var linesep = font.TextHeight("M") + element.m_lineSpacing;
	var computed_width;
	var computed_height;

	if (element.m_wrap && this.stretchWidth)
	{
		/* Wrapped text, stretched to flexpanel width.
		 * Element size is the extent of the text wrapped within the maximum available panel size.
		*/

		g_pFontManager.GR_Text_Sizes(element.m_text, -1, -1, linesep, max_container_width);
		computed_width = g_ActualTextWidth;
		computed_height = g_ActualTextHeight;
	}
	else if (element.m_wrap)
	{
		/* Wrapped text.
		 * Element size is the extent of the text wrapped within the defined frame width.
		*/

		g_pFontManager.GR_Text_Sizes(element.m_text, -1, -1, linesep, element.m_frameW);
		computed_width = g_ActualTextWidth;
		computed_height = g_ActualTextHeight;
	}
	else {
		/* Non-wrapped text.
		 * Element size is the extent of the text.
		*/

		g_pFontManager.GR_Text_Sizes(element.m_text, -1, -1, linesep, -1);
		computed_width = g_ActualTextWidth * this.textScaleX;
		computed_height = g_ActualTextHeight * this.textScaleY;
	}

	g_pFontManager.fontid = old_font;

	return { width: computed_width, height: computed_height };
};
