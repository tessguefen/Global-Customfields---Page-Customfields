# Global Customfields & Page Customfields

```
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( 'gfm_1', l.settings:my_field)" />
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( 'gfm_1,some_code', l.settings:my_fields)" />
<mvt:do file="g.Module_Root $ '/modules/util/tgcfm.mvc'" name="l.void" value="Load_Global_Fields( '', l.settings:all_global_fields)" />
```