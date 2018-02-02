# Global Customfields & Page Customfields

Items
```xml
<mvt:item name="tgcfm" param="Load_Global_Fields( 'code_1', l.settings:my_field )" />
<mvt:item name="tgcfm" param="Load_Global_Fields( 'code_1, code_2', l.settings:my_fields )" />
<mvt:item name="tgcfm" param="Load_Global_Fields( '', l.settings:all_global_fields )" />

<mvt:item name="tgcfm" param="Load_PageCode_Fields( 'SFNT', 'code_1', l.settings:sfnt_customfields )" />
<mvt:item name="tgcfm" param="Load_PageCode_Fields( 'SFNT', 'code_1, code_2', l.settings:sfnt_customfields )" />
<mvt:item name="tgcfm" param="Load_PageCode_Fields( 'SFNT', '', l.settings:sfnt_customfields )" />

<mvt:item name="tgcfm" param="Load_PageID_Fields( l.settings:somepage:id, 'code_1', l.settings:sfnt_customfields )" />
<mvt:item name="tgcfm" param="Load_PageID_Fields( l.settings:somepage:id, 'code_1, code_2', l.settings:sfnt_customfields )" />
<mvt:item name="tgcfm" param="Load_PageID_Fields( l.settings:somepage:id, '', l.settings:sfnt_customfields )" />
```

Global Customfields (on Load, Fields that are set to "Preload" will populate)
```
g.Store:customfield_values:customfields:[code]
g.Store:customfield_names:customfields:[code]
```

Page Customfields (on Load, with `tgcfm` item assigned)
```
l.settings:page:customfield_values:customfields:[code]
l.settings:page:customfield_names:customfields:[code]
```

# Screenshots
![Page Customfields Batchlist](https://puu.sh/ze892/96203114b6.png)

![Page Customfield Groups Batchlist](https://puu.sh/ze87t/db3d772a29.png)

![Global Customfields Batchlist](http://puu.sh/ze8aB/1e35a7567f.png)

![Page Edit Screen](https://puu.sh/ze8c0/999c43e18a.png)