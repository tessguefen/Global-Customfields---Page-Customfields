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

function TGCFM_GroupsBatchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCFM',
								'TGCFS_Group_Delete',
								'ID=' + encodeURIComponent( id ),
								delegator );
}

function TGCFM_GroupsBatchlist_Insert( fieldlist, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCFM',
									   'TGCFS_Group_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function TGCFM_GroupsBatchlist_Update( id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCFM',
									   'TGCFS_Group_Update',
									   'Group_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}


function TGCFM_GroupsBatchlist() {
	var self = this;
	MMBatchList.call( self, 'jsTGCFM_GroupsBatchlist' );
	self.Feature_Persistent_Filters_Enable( 'jsTGCFM_GroupsBatchlist' );
	self.Feature_SearchBar_SetPlaceholderText( 'Search Groups...' );
	self.SetDefaultSort( 'id', '-' );
	self.Feature_Add_Enable('Add Group');
	self.Feature_Edit_Enable('Edit Group(s)');
	self.Feature_Delete_Enable('Delete Group(s)');
	self.Feature_RowDoubleClick_Enable();
}

DeriveFrom( MMBatchList, TGCFM_GroupsBatchlist );

TGCFM_GroupsBatchlist.prototype.onLoad = TGCFM_Groups_Load_Query;

TGCFM_GroupsBatchlist.prototype.onCreateRootColumnList = function() {
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
		new MMBatchList_Column_Name( 'Name', 'name', 'name')
	];

	return columnlist;
}

TGCFM_GroupsBatchlist.prototype.onCreate = function() {
	var self = this;
	var record;
	record = new Object();
	record.id = 0;
	record.code = '';
	record.name = '';
	return record;
}

TGCFM_GroupsBatchlist.prototype.onSave = function( item, callback, delegator ) {
	TGCFM_GroupsBatchlist_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

TGCFM_GroupsBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	TGCFM_GroupsBatchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

TGCFM_GroupsBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	TGCFM_GroupsBatchlist_Delete( item.record.id, callback, delegator );
}