function TGCFM_Global_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCFM',
								'JSON_Global_CFS_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}

function TGCFM_GlobalBatchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCFM',
								'TGCFS_Global_Delete',
								'ID=' + encodeURIComponent( id ),
								delegator );
}

function TGCFM_GlobalBatchlist_Insert( fieldlist, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCFM',
									   'TGCFS_Global_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function TGCFM_GlobalBatchlist_Update( id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCFM',
									   'TGCFS_Global_Update',
									   'CF_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}


function TGCFM_GlobalBatchlist() {
	var self = this;
	MMBatchList.call( self, 'jsTGCFM_GlobalBatchlist' );
	self.Feature_SearchBar_SetPlaceholderText( 'Search Customfields...' );
	self.SetDefaultSort( 'id', '-' );
	self.Feature_Add_Enable('Add Customfield');
	self.Feature_Edit_Enable('Edit Customfield(s)');
	self.Feature_Delete_Enable('Delete Customfield(s)');
	self.Feature_RowDoubleClick_Enable();
}

DeriveFrom( MMBatchList, TGCFM_GlobalBatchlist );

TGCFM_GlobalBatchlist.prototype.onLoad = TGCFM_Global_Load_Query;

TGCFM_GlobalBatchlist.prototype.onCreateRootColumnList = function() {
		var self = this;
		var columnlist = [];

		var columnlist =
	[
		new MMBatchList_Column_Name( 'ID', 'id', 'id')
			.SetAdvancedSearchEnabled(false)
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Code( 'Code', 'code', 'code'),
		new MMBatchList_Column_Name( 'Name', 'name', 'name'),
		new MMBatchList_Column_Name( 'Value', 'value', 'value')
	];

	return columnlist;
}

TGCFM_GlobalBatchlist.prototype.onCreate = function() {
	var self = this;
	var record;
	record = new Object();
	record.id = 0;
	record.code = '';
	record.name = '';
	record.value = '';
	return record;
}

TGCFM_GlobalBatchlist.prototype.onSave = function( item, callback, delegator ) {
	TGCFM_GlobalBatchlist_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

TGCFM_GlobalBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	TGCFM_GlobalBatchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

TGCFM_GlobalBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	TGCFM_GlobalBatchlist_Delete( item.record.id, callback, delegator );
}