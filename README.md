# Global Customfields & Page Customfields

```
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( 'gfm_1', l.settings:my_field)" />
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( 'gfm_1,some_code', l.settings:my_fields)" />
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( '', l.settings:all_global_fields)" />
```

Page Customfields (on Load, with `tgcfm` item assigned)
```
l.settings:page:customfield_values:customfields:[code]
l.settings:page:customfield_names:customfields:[code]
```




notes

- add toggle for global to load by default or not
- create item for global items `Load_Global_Fields`
- create item for page items `Load_PageCode_Fields`/ `Load_PageID_Fields`
