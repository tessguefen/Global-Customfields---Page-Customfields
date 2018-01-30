function PageFieldList_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module( 	callback,
								'admin',
								'tgcfm',
								'JSON_PageFields_Load_Query',
								'Filter='	+ EncodeArray( filter ) 		+
								'&Sort=' 	+ encodeURIComponent( sort ) 	+
								'&Offset=' 	+ encodeURIComponent( offset ) 	+
								'&Count=' 	+ encodeURIComponent( count ),
								delegator );
} 

function PageField_Insert( code, name, fieldtype, info, group_id, option_values, callback ) 
{ 
	return AJAX_Call_Module( 	callback,
								'admin',
								'tgcfm',
								'PageField_Insert',
								'Code=' 			+ encodeURIComponent( code ) 		+ 
								'&Name=' 			+ encodeURIComponent( name ) 		+
								'&Field_Type='		+ encodeURIComponent( fieldtype )	+
								'&Info='			+ encodeURIComponent( info )		+
								'&Group_ID='		+ encodeURIComponent( group_id )	+
								'&Option_Values='	+ EncodeArray( option_values ) );
}

function PageField_Update( id, code, name, fieldtype, info, group_id, option_values, callback ) 
{ 
	return AJAX_Call_Module(	callback,
								'admin',
								'tgcfm',
								'PageField_Update',
								'Field_ID='			+ encodeURIComponent( id )			+
								'&Code=' 			+ encodeURIComponent( code ) 		+ 
								'&Name=' 			+ encodeURIComponent( name ) 		+
								'&Field_Type='		+ encodeURIComponent( fieldtype )	+
								'&Info='			+ encodeURIComponent( info )		+
								'&Group_ID='		+ encodeURIComponent( group_id )	+
								'&Option_Values='	+ EncodeArray( option_values ) );
}

function PageField_Delete( id, type, callback, delegator )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'tgcfm',
								'PageField_Delete',
								'Field_ID=' + encodeURIComponent( id ) + 
								'&Type='	+ encodeURIComponent( type ),
								delegator);
}


function PageFieldList()
{
	MMBatchList.call( this, 'jsTGCFM_PageFieldsBatchlist' );

	this.Feature_Buttons_AddButton_Persistent( '', 'New Custom Field', 'add', this.Add );
	this.Feature_EditDialog_Enable( 'Edit Custom Field' );
	this.Feature_Delete_Enable( 'Delete Custom Field(s)' );

	this.Feature_SearchBar_SetPlaceholderText( 'Search Custom Fields...' );
	this.SetDefaultSort( 'code' );
}

DeriveFrom( MMBatchList, PageFieldList );

PageFieldList.prototype.onLoad = PageFieldList_Load_Query;

PageFieldList.prototype.Add = function()
{
	var self = this;
	var Pagefieldadd;

	Pagefieldadd			= new PageField_AddEditDialog( null );
	Pagefieldadd.onsave	= function() { self.Refresh(); }

	Pagefieldadd.Show();
}

PageFieldList.prototype.onDelete = function( item, callback, delegator )
{
	PageField_Delete( item.record.id, item.record.type, callback, delegator );
}

PageFieldList.prototype.onEdit = function( item )
{
	var self = this;
	var Pagefieldedit;

	Pagefieldedit				= new PageField_AddEditDialog( item.record, true );
	Pagefieldedit.onsave		= function() { self.Refresh(); }
	Pagefieldedit.ondelete	= function() { self.Refresh(); }

	Pagefieldedit.Show();
}

PageFieldList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Code( 'Code', 'code' ),
		new MMBatchList_Column_Name( 'Name', 'name' ),

		new PageFieldList_Column_Group( 'Group' ),
		new PageFieldList_Column_FieldType( 'Field Type' ),

		new MMBatchList_Column_Name( 'Additional Information', 'info' )
	];

	return columnlist;
}

// PageFieldList_Column_Group

function PageFieldList_Column_Group( header_text )
{
	MMBatchList_Column_Text.call( this, header_text, 'group' );

	this.groups_loaded = false;

	this.SetOnDisplayData( function( record ) { return DrawMMBatchListString_Data( record.formatted_group ); } );
}

DeriveFrom( MMBatchList_Column_Text, PageFieldList_Column_Group );

PageFieldList_Column_Group.prototype.onAdvancedSearch_ConstructFilter = function()
{
	var self = this;

	this.groups_loaded					= false;

	this.element_filter					= newElement( 'select',		{ 'class': 'mm9_batchlist_advancedsearch_column_filter_select' }, null, null );
	this.element_filter.options[ 0 ]	= new Option( 'Loading...',	'' );
	this.element_filter.disabled		= true;

	TGCFM_Groups_Load_Query( '', 'name', 0, 0, function( response ) { self.PageFieldGroupList_Load_Callback( response ); } );

	return this.element_filter;
}

PageFieldList_Column_Group.prototype.PageFieldGroupList_Load_Callback = function( response )
{
	var i;

	this.groups_loaded															= true;

	this.element_filter.options.length											= 0;
	this.element_filter.options[ this.element_filter.options.length ]			= new Option( '<All>',						'' );
	this.element_filter.options[ this.element_filter.options.length ]			= new Option( '<Default>',					0 );

	if ( response.success )
	{
		for ( i = 0; i < response.data.data.length; i++ )
		{
			this.element_filter.options[ this.element_filter.options.length ]	= new Option( response.data.data[ i ].name,	response.data.data[ i ].id );
		}
	}

	this.element_filter.disabled												= false;
}

PageFieldList_Column_Group.prototype.onAdvancedSearch_ConstructValue = function()
{
	return document.createTextNode( '' );
}

PageFieldList_Column_Group.prototype.onAdvancedSearch_GetFilter = function()
{
	var filter;

	if ( this.element_filter.selectedIndex == 0 )
	{
		return null;
	}

	filter =
	{
		'code':     'group_id',
		'filter':   'EQ',
		'value':    this.element_filter.value
	};

	return [ filter ];
}

PageFieldList_Column_Group.prototype.onAdvancedSearch_SaveFilter = function()
{
	if ( this.element_filter.options[ this.element_filter.selectedIndex ].value == '' )
	{
		return null;
	}

	return encodeURIComponent( this.element_filter.options[ this.element_filter.selectedIndex ].value );
}

PageFieldList_Column_Group.prototype.onAdvancedSearch_RestoreInitializing = function()
{
	return !this.groups_loaded;
}

PageFieldList_Column_Group.prototype.onAdvancedSearch_RestoreFilter = function( settings )
{
	var i, i_len, filter;

	filter 								= decodeattribute( settings );
	this.element_filter.selectedIndex 	= 0;

	for ( i = 0, i_len = this.element_filter.options.length; i < i_len; i++ )
	{
		if ( this.element_filter.options[ i ].value == filter )
		{
			this.element_filter.selectedIndex = i;
			break;
		}
	}
}

// PageFieldList_Column_FieldType

function PageFieldList_Column_FieldType( header_text )
{
	MMBatchList_Column_Text.call( this, header_text, 'fieldtype' );

	this.SetOnDisplayData( function( record ) { return DrawMMBatchListString_Data( record.formatted_fieldtype ); } );
}

DeriveFrom( MMBatchList_Column_Text, PageFieldList_Column_FieldType );

PageFieldList_Column_FieldType.prototype.onAdvancedSearch_ConstructFilter = function()
{
	this.element_filter														= newElement( 'select',			{ 'class': 'mm9_batchlist_advancedsearch_column_filter_select' }, null, null );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Any',			'' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Text Field',		'textfield' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Text Area',		'textarea' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Radio',			'radio' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Drop-Down List',	'dropdown' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Checkbox',		'checkbox' );
	this.element_filter.options[ this.element_filter.options.length ]		= new Option( 'Image Upload',	'imageupload' );

	return this.element_filter;
}

PageFieldList_Column_FieldType.prototype.onAdvancedSearch_ConstructValue = function()
{
	return document.createTextNode( '' );
}

PageFieldList_Column_FieldType.prototype.onAdvancedSearch_GetFilter = function()
{
	var filter;

	if ( this.element_filter.value == '' )
	{
		return null;
	}

	filter =
	{
		'code':     this.code,
		'filter':   'EQ',
		'value':    this.element_filter.value
	};

	return [ filter ];
}

PageFieldList_Column_FieldType.prototype.onAdvancedSearch_SaveFilter = function()
{
	if ( this.element_filter.options[ this.element_filter.selectedIndex ].value == '' )
	{
		return null;
	}

	return encodeURIComponent( this.element_filter.options[ this.element_filter.selectedIndex ].value );
}

PageFieldList_Column_FieldType.prototype.onAdvancedSearch_RestoreFilter = function( settings )
{
	var i, i_len, filter;

	filter 								= decodeattribute( settings );
	this.element_filter.selectedIndex 	= 0;

	for ( i = 0, i_len = this.element_filter.options.length; i < i_len; i++ )
	{
		if ( this.element_filter.options[ i ].value == filter )
		{
			this.element_filter.selectedIndex = i;
			break;
		}
	}
}
