import { defineStore } from 'pinia';

interface Location {
    lat: string;
    lon: string;
    display_name: string;
    name: string;
    place_id: string;
    osm_type: string;
    osm_id: string;
    class: string;
    type: string;
    importance: number;
    boundingbox: string[];
}

export const useMapStore = defineStore('map', {
    state: () => ({
        selectedLocation: null as Location | null,
        mapTitle: '' as string,
        mapSubtitle: '' as string,
        mapTitleSize: 50 as number, // Default title size (0-100) - 50 = tamaño normal
        mapSubtitleSize: 50 as number, // Default subtitle size (0-100) - 50 = tamaño normal
        selectedStyle: 'minimal' as string,
        selectedComposition: 'classy' as string,
        showInfo: true as boolean,
        customInfo: '' as string,
        mapAspect: '50:70' as string,
        mapLandscape: false as boolean,
        mapBounds: null as any | null,
        mapZoom: null as number | null,
        mapWidth: null as number | null,
        mapHeight: null as number | null,
    }),

    actions: {
        setSelectedLocation(location: Location) {
            this.selectedLocation = location;
            // Auto-generate title from location name
            this.mapTitle = location.name || location.display_name.split(',')[0];
            // Clear previous map bounds and zoom when selecting a new location
            this.mapBounds = null;
            this.mapZoom = null;
        },

        updateLocationCoordinates(lat: number, lon: number) {
            if (this.selectedLocation) {
                this.selectedLocation.lat = lat.toString();
                this.selectedLocation.lon = lon.toString();
            }
        },

        setMapTitle(title: string) {
            this.mapTitle = title;
        },

        setMapSubtitle(subtitle: string) {
            this.mapSubtitle = subtitle;
        },

        clearLocation() {
            this.selectedLocation = null;
            this.mapTitle = '';
            this.mapSubtitle = '';
            this.customInfo = '';
            this.mapAspect = '50:70';
            this.mapLandscape = false;
            this.mapBounds = null;
            this.mapZoom = null;
            this.mapWidth = null;
            this.mapHeight = null;
        },

        setSelectedStyle(style: string) {
            this.selectedStyle = style;
        },

        setSelectedComposition(composition: string) {
            this.selectedComposition = composition;
        },

        setMapBounds(bounds: any) {
            this.mapBounds = bounds;
        },

        setMapZoom(zoom: number) {
            this.mapZoom = zoom;
        },

        setMapDimensions(width: number, height: number) {
            this.mapWidth = width;
            this.mapHeight = height;
        },

        setMapData(mapData: any) {
            // Set all map data at once
            if (mapData.bounds) this.mapBounds = mapData.bounds;
            if (mapData.zoom) this.mapZoom = mapData.zoom;
            if (mapData.width) this.mapWidth = mapData.width;
            if (mapData.height) this.mapHeight = mapData.height;
        },
    },

    getters: {
        hasSelectedLocation(): boolean {
            return this.selectedLocation !== null;
        },

        locationCoordinates(): { lat: number; lon: number } | null {
            if (!this.selectedLocation) return null;

            return {
                lat: parseFloat(this.selectedLocation.lat),
                lon: parseFloat(this.selectedLocation.lon),
            };
        },

        locationDisplayName(): string {
            return this.selectedLocation?.display_name || '';
        },
    },

    persist: {
        key: 'mapster-map-store',
        paths: [
            'selectedLocation',
            'mapTitle',
            'mapSubtitle',
            'mapTitleSize',
            'mapSubtitleSize',
            'selectedStyle',
            'selectedComposition',
            'showInfo',
            'customInfo',
            'mapAspect',
            'mapLandscape',
            'mapBounds',
            'mapZoom',
            'mapWidth',
            'mapHeight',
        ],
    },
});
