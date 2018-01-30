function TGCFM_Groups_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCFM',
								'JSON_Groups_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}


function GroupList_Load_All( callback )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'tgcfm',
								'JSON_GroupList_Load_All',
								'' );
}

function PageField_AddEditDialog( pagefield )
{
	var self = this;

	// Variables
	this.pagefield		= pagefield;
	this.optionlist			= new Array();
	this.can_modify			= CanI( 'SUTL', 0, 0, 1, 0 );

	// Controls
	this.dialog				= document.getElementById( 'pagefield_addeditdialog' );
	this.title				= document.getElementById( 'pagefield_addeditdialog_title' );	

	this.edit_code			= document.getElementById( 'pagefield_addeditdialog_edit_code' );
	this.edit_name			= document.getElementById( 'pagefield_addeditdialog_name' );
	this.edit_fieldtype		= document.getElementById( 'pagefield_addeditdialog_fieldtype' );
	this.edit_info			= document.getElementById( 'pagefield_addeditdialog_info' );
	this.edit_group			= document.getElementById( 'pagefield_addeditdialog_group' );
	
	this.button_cancel		= document.getElementById( 'pagefield_addeditdialog_button_cancel' );
	this.button_delete		= document.getElementById( 'pagefield_addeditdialog_button_delete' );
	this.button_save		= document.getElementById( 'pagefield_addeditdialog_button_save' );
	this.button_addplus		= document.getElementById( 'pagefield_addeditdialog_button_addplus' );
	this.button_add			= document.getElementById( 'pagefield_addeditparameter_add' );
	
	this.options_table		= document.getElementById( 'pagefield_addeditdialog_options_table' );
	this.options			= document.getElementById( 'pagefield_addeditdialog_options' );
	this.option_value		= document.getElementById( 'pagefield_addeditparameter_value' );

	// Events
	if ( this.button_cancel )	this.button_cancel.onclick		= function() { self.Cancel(); }
	if ( this.button_save )		this.button_save.onclick		= function() { if ( self.can_modify || !self.pagefield ) self.Save( 0 ); }
	if ( this.button_addplus )	this.button_addplus.onclick		= function() { if ( self.can_modify || !self.pagefield ) self.Save( 1 ); }
	if ( this.button_delete )	this.button_delete.onclick		= function() { if ( self.can_modify ) self.Delete(); }
	if ( this.edit_fieldtype )	this.edit_fieldtype.onchange	= function() { if ( self.can_modify || !self.pagefield ) self.ModifyFieldOptions(); }
	if ( this.button_add )		this.button_add.onclick			= function() { if ( self.can_modify || !self.pagefield ) self.AddOption(); }

	this.Group_List_Load();
}

PageField_AddEditDialog.prototype.Group_List_Load = function()
{
	var self = this;

	GroupList_Load_All( function( response ) { self.Group_List_Load_Callback( response ); } );
}

PageField_AddEditDialog.prototype.Group_List_Load_Callback = function( response )
{
	var i;
	var groups = response.data;

	this.edit_group.options.length = 0;
	
	for ( i = 0; i < groups.length; i++ )
	{
		this.edit_group.options[ this.edit_group.options.length ] = new Option( groups[ i ].name, groups[ i ].id )

		if ( this.pagefield && this.pagefield.group_id == groups[ i ].id )
		{
			this.edit_group.selectedIndex = this.edit_group.options.length - 1;
		}
	}
}

PageField_AddEditDialog.prototype.ModifyFieldOptions = function()
{
	var fieldtype_value;

	fieldtype_value	= this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ] ? this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ].value : '';

	if ( fieldtype_value != 'dropdown' && fieldtype_value != 'radio' )
	{
		this.options_table.style.display	= 'none';
		this.options.style.display			= 'none';
		this.button_add.disabled 			= true;
	}
	else
	{
		this.options_table.style.display	= '';
		this.options.style.display			= '';
		this.button_add.disabled 			= false;
	}

	Modal_Resize();
}

PageField_AddEditDialog.prototype.AddOption = function()
{
	if ( this.option_value.value.length == 0 )
	{
		this.onerror( 'Please enter a value' );
		this.option_value.focus();

		return false;
	}
	
	new PageField_Parameter( this, this.option_value.value );

	this.option_value.value = '';
}

PageField_AddEditDialog.prototype.RemoveOption = function( pagefield )
{
	var i;

	for ( i = 0; i < this.optionlist.length; i++ )
	{
		if ( this.optionlist[ i ] == pagefield )
		{
			this.optionlist.splice( i, 1 );
		}
	}

	this.options.removeChild( pagefield.tr );
	
	Modal_Resize();
}

PageField_AddEditDialog.prototype.Show = function()
{	
	if ( this.pagefield )	this.ShowEdit();
	else					this.ShowAdd();
	
	this.ModifyFieldOptions();
}

PageField_AddEditDialog.prototype.ShowEdit = function()
{
	var self = this;
	var i, i_len;

	this.title.innerHTML				= 'Edit Custom Field';
	this.edit_code.value				= this.pagefield.code;
	this.edit_name.value				= this.pagefield.name;
	this.edit_info.value				= this.pagefield.info;
	this.option_value.value 			= '';
	
	this.button_save.value				= 'Save';
	this.button_save.style.display		= this.can_modify ? 'inline' : 'none';
	this.button_delete.style.display	= this.can_modify ? 'inline' : 'none';
	this.button_add.style.display		= this.can_modify ? 'inline' : 'none';
	this.button_addplus.style.display	= 'none';

	for ( i = 0, i_len = this.edit_fieldtype.options.length; i < i_len; i++ )
	{
		if ( this.pagefield.fieldtype == this.edit_fieldtype.options[ i ].value )
		{
			this.edit_fieldtype.selectedIndex = i;
			break;
		}
	}
	
	EmptyElement( this.options );
	
	for ( i = 0; i < this.pagefield.additional_options.length; i++ )
	{
		new PageField_Parameter( this, this.pagefield.additional_options[ i ].value );
	}

	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_code.focus();
}

PageField_AddEditDialog.prototype.ShowAdd = function()
{
	var self = this;

	this.title.innerHTML				= 'Add Custom Field';	
	this.edit_code.value				= '';
	this.edit_name.value				= '';
	this.edit_info.value				= '';
	this.option_value.value 			= '';
	this.edit_fieldtype.selectedIndex	= 0;
	this.optionlist						= new Array();
	
	EmptyElement( this.options );

	this.button_save.value				= 'Add';
	this.button_addplus.value			= 'Add +';
	this.button_save.style.display		= 'inline';
	this.button_addplus.style.display	= 'inline';
	this.button_delete.style.display	= 'none';
	
	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_code.focus();
}

PageField_AddEditDialog.prototype.Hide = function()
{
	Modal_Hide();
}

PageField_AddEditDialog.prototype.Cancel = function()
{
	this.Hide();
	this.oncancel();
}

PageField_AddEditDialog.prototype.Save = function( plus )
{	
	var self = this;
	var i;
	var option_values = new Array();
	
	if ( this.edit_code.value == '' )
	{
		this.onerror( 'Code cannot be blank' );
		this.edit_code.focus();
		
		return false;
	}
	
	for ( i = 0; i < this.optionlist.length; i++ )
	{		
		if ( !this.optionlist[ i ].Validate() )
		{
			return false;
		}
		
		option_values.push( this.optionlist[ i ].option_value.value );
	}
	
	if ( this.pagefield )
	{
		PageField_Update(	this.pagefield.id,
							this.edit_code.value,
							this.edit_name.value, 
							this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ] ? this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ].value : '',
							this.edit_info.value,
							this.edit_group.options[ this.edit_group.selectedIndex ] ? this.edit_group.options[ this.edit_group.selectedIndex ].value : '',
							option_values,
							function( response ) { self.Save_Callback( plus, response ); } );
	}
	else
	{
		PageField_Insert(	this.edit_code.value, 
							this.edit_name.value,
							this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ] ? this.edit_fieldtype.options[ this.edit_fieldtype.selectedIndex ].value : '',
							this.edit_info.value,
							this.edit_group.options[ this.edit_group.selectedIndex ] ? this.edit_group.options[ this.edit_group.selectedIndex ].value : '',
							option_values,
							function( response ) { self.Save_Callback( plus, response ); } );
	}
}

PageField_AddEditDialog.prototype.Save_Callback = function( plus, response )
{
	this.button_save.value		= this.pagefield ? "Save" : "Add";
	this.button_save.disabled	= false;

	if ( !response.success )
	{
		if ( response.error_code == 'invalid_code' )
		{
			this.edit_code.focus();
		}
		else if ( response.error_code == 'invalid_name' )
		{
			this.edit_name.focus();
		}
		
		return this.onerror( response.error_message );
	}

	if ( !plus )
	{
		this.Hide();
	}
	else
	{
		this.ClearAdd();
		this.edit_code.focus();
	}
	
	this.onsave();
}

PageField_AddEditDialog.prototype.ClearAdd = function()
{	
	this.edit_code.value				= '';
	this.edit_name.value				= '';
	this.edit_info.value				= '';
	this.option_value.value 			= '';	
	this.optionlist						= new Array();
	
	EmptyElement( this.options );
}

PageField_AddEditDialog.prototype.Delete = function()
{
	var self = this;

	if ( !confirm( 'Deleting a custom field cannot be undone.  Continue?' ) )
	{
		return;
	}

	PageField_Delete( this.pagefield.id, this.pagefield.type, function( response ) { self.Delete_Callback( response ); } );
}

PageField_AddEditDialog.prototype.Delete_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Hide();
	this.ondelete();
}

PageField_AddEditDialog.prototype.onerror		= function( error )	{ Modal_Alert( error ); }
PageField_AddEditDialog.prototype.oncancel	= function()		{ ; }
PageField_AddEditDialog.prototype.onsave		= function()		{ ; }
PageField_AddEditDialog.prototype.ondelete	= function()		{ ; }

// PageField Parameter
////////////////////////////////////////////////////

function PageField_Parameter( dialog, option_value )
{
	this.tr								= document.createElement( 'tr' );
	this.tr.className					= 'mm_dialog_data_row';
	
	this.blank_td						= document.createElement( 'td' );
	this.blank_td.innerHTML				= '&nbsp;';
	
	this.option_value_td				= document.createElement( 'td' );	
	this.option_value					= document.createElement( 'input' );
	this.option_value.className			= 'parameter_input_attribute';
	this.option_value.value				= option_value;
	this.option_value_td.appendChild( this.option_value );
	
	this.button_remove					= document.createElement( 'input' );
	this.button_remove.type				= 'button';
	this.button_remove.value			= 'Remove';
	this.button_remove.style.display	= dialog.can_modify ? 'inline' : 'none';
	this.option_value_td.appendChild( this.button_remove );
	
	this.tr.appendChild( this.blank_td );
	this.tr.appendChild( this.option_value_td );

	this.button_remove.pagefield		= this;
	this.button_remove.onclick			= function() { dialog.RemoveOption( this.pagefield ); return false; }

	dialog.optionlist.push( this );
	dialog.options.appendChild( this.tr );
}

PageField_Parameter.prototype.Validate = function()
{
	if ( this.option_value.value.length == 0 )
	{
		this.onerror( 'Please enter a value' );
		this.option_value.focus();

		return false;
	}
	
	return true;
}

PageField_Parameter.prototype.onerror = function( error ) { Modal_Alert( error ); }
