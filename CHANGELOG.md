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