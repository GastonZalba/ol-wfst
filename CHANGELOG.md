# Changelog

## v1.0.0
* Module created

## v1.0.1
* Improved widget controller:
    - Changed css style
    - Removed select tool
    - Added a visibility toggler on each layer

## v1.0.2
* Added support for using different modes on each layer ('wfs' or 'wms')
* Default value in layer mode is now 'wfs'
* Extra Layer options can be set on each layer (styles, zindex, etc)
* Improved loading indicator
* Fixed the bug that did not show vertices in LineStrings

## v1.0.3
* Specified the CRS in 'bbox' param

## v1.0.4
* DescribeFeatureType request changed to version 1.1.0

## v1.0.5
* Some minor improvements in the package configuration

## v1.0.6
* Fixed bug: changed parameter typeNames to typeName on DescribeFeatureType requests

## v1.0.7
* Fixed readme links

## v1.0.8
* Fixed some css
* Fixed bug on Open Layers 5 preventing select the features: getFeatureInfoUrl vs getGetFeatureInfoUrl
* Fixed bug on Open Layers 5 when creating two Select on the same map

## v1.0.9
* Fixed error notification on requesting to offlines geoservers
* Fixed PeerDependencies

## v2.0.0
* Improved css bootstrap
* Added option "modal" to customize modals
* Added option "i18n" to allow custom translations

## v3.0.0
* Refactored code: class extends class ol.control.Control (breaking changes)
* Added geoserverAdvanced to allow customizethe geoserver requests
* Changed default projection to 'EPSG:3857'
* Fixed types for recent versions of ol
* Updated dependencies
* Moved modal-vanilla to dependencies
* Added events
* Added Delete button on Edit Mode
* css to scss

## v3.0.1
* Fixed loading msg

## v3.0.2
* Added Mandarin Chinese (zh) language
* Fixed some english translations

## v3.0.3
* Added _credentials_ option for fetch requests

## v3.0.5
* Added public method to get the layers
* Fix "loading" msg on init
* Added event 'load'

## v3.0.6
* Added event 'visible'

## v3.0.7
* Improved error handling:
    * The original errors returned by the geoserver are now displayed
    * Only display one error modal per layer
* Added extra geoserver options through the `geoserverOptions` attribute
    
## v4.0.0
* Added Ol 7 compatibility
* Overall refactoring
* Improved README
* Added events
* Changed License

## v4.0.1
* Created `setCustomParam` method on layers and removed from the sources

## v4.0.2
* Add option to pass `undefined` or `null` values on the `setCustomParam` method on wfs layers to delete the param

## v4.0.3
* Moved modal-vanilla to peer dependencies

## v4.0.4
* Updated dependencies

## v4.0.5
* Moved ts-mixer to prod dependencies

## v4.0.6
* Updated dependencies
* Added new event 'sourceready' (Ol 7.2.0)
* Removed "browser" attribute from package.json
* Improved error handling 

## v4.1.0
* Added ".js" extension on imports to work better with webpack 5 default's config
* Lib is builded with es2017 target (downgraded from esnext)
* Removed babel deps
* Added header to dist files
* Fixed example missing css

## v4.1.1
* Fix `load` event dispatched before time
* Changed default `getCapabilities` version to `2.0.0`
* Added `ol-wfs-capabilities` dependency to parse `2.0.0` capabilities
* Added `getParsedCapabilities` geoserver method (only for version `2.0.0`)
* Limit bootstrap version

## v4.2.0
* *IMPORTANT*: Improved the geometry accuracy obtained at WMS layers: the geometry returned by the WMS `getFeatureInfo` is now replaced by a (probably) more accurate version returned by the WFS `getFeature`.
* Fix missing credentials and headers configuration in some Requests
* Updated to Ol8
* Updated to Bootstrap 5.3.0
* Updated mulitple dev dependencies

## v4.3.0
* Fixed bug when layernames includes workspaces
* Fixed bug when draw mode is on and another layer is selected
* Updated to Ol9 (fixed some types)
* Some scss refactoring and minor improvements
* Fixed cql_filter example on string values
* Fixed delete button inside the fields modal

## v4.4.0
* Added method `beforeShowFieldsModal` and example to customize the fields in the modal
* Improved support for `xsd:date` and `xsd:double` type fields
* Added some missing types
* Converted some files to tsx
* Fix unnecesary `getFeature` requests when there is no element selected