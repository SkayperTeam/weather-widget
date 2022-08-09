<template>
    <div class="settings" :class="settingsActive? 'active':''">
        <div class="settings_header">
            Настройки
        </div>
        <ul class="settings_weathers-list">
            <li 
                draggable="true"
                class="settings_weathers-list_item"
                v-for="(item, index) in weatherInCities" :key="index"
                @dragstart="onDragStart(item, index)"
                @dragleave="onDragLeave"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOver"
                @drop.prevent="onDrop(item, index)"
                >
                <button @mousedown="move" class="settings_weathers-list_item_move-btn">
                    <img src="https://skayperteam.github.io/img/widgetSettingsMoveIcon.svg" alt="изменение порядка отображения погоды" />
                </button>
                <span class="settings_weathers-list_item_text">
                    {{item.name+", "+item.sys.country}}
                </span>
                <button @click="removeElement(index)" class="settings_weathers-list_item_remove-btn">
                    <img src="https://skayperteam.github.io/img/widgetSettingsDeleteElementIcon.svg" alt="Удаление информации о погоде">
                </button>
            </li>
        </ul>
        <div class="settings_add-location">
            <p class="settings_add-location_title">Добавить локацию:</p>
            <form>
                <input class="settings_add-location_input" v-model='newLocation' type="text">
                <button class="settings_add-location_btn" @click.prevent="addNewLocation"><img src="https://skayperteam.github.io/img/widgetSettingEnterLocationIcon.svg" alt="Ввод"></button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    data() {
        return {
            newLocation: "" as string,
            currentCard: null as unknown as object
            // settingsActive: false as boolean,

        }
    },
    props: {
        settingsActive: {
            default: false,
            type: Boolean
        },
        weatherInCities: {
            default: [],
            type: Array
        }
    },
    methods: {
        move(e: Event) {
            // @ts-ignore-next-line
            (e.target as HTMLElement).parentElement!.dispatchEvent(dragstart)
            
        },
        ChangeCardList(card: object, index: number ) {
            this.$emit('ChangeCardList', {
                'onDropCard': {
                    index: index,
                    card: card
                    },
                'currentCard': this.currentCard,
            })
        },
        setCurrentCard(card: object, index: number) {
            this.currentCard = {
                index: index,
                card: card
                };
        },
        onDragStart(card: object, index: number) {
            this.setCurrentCard(card, index);
        },
        onDragLeave(e: Event) {
            
            (e.target as HTMLElement).style.background = 'lightgray'
        },
        onDragEnd(e: Event) {
            (e.target as HTMLElement).style.background = 'lightgray'
            
        },
        onDragOver(e: Event) {
            (e.target as HTMLElement).style.background = 'white'
            
        },
        onDrop(card: object, index: number) {            
            this.ChangeCardList(card, index)
            // console.log('drop', index, card);
            
        },
        removeElement(index: number) {
            this.$emit('removeWeatherElement', index as number);
        },
        addNewLocation() {
            this.$emit('addNewLocation', this.newLocation as string);
            this.newLocation = "";
        }
    }
})
</script>

<style lang="sass" scoped>
.settings
    overflow-x: auto
    padding: 10px 20px
    position: absolute
    background-color: #fff
    width: 100%
    height: 100%
    z-index: 1
    top: 0
    right: -350px
    transition: right 2s
    &_header
        text-align: left
    &_weathers-list
        padding-top: 30px
        width: 100%
        &_item
            // pointer-events: none
            width: 100%
            list-style: none
            background-color: lightgray
            height: 50px
            margin-bottom: 20px
            display: flex
            flex: start
            padding: 0 20px 0 20px
            align-items: center
            &_move-btn
                width: 30px
                opacity: .5
                margin-right: 20px
                background: none !important
                outline: none
                border: none
                cursor: grab
                pointer-events: auto
                img
                    pointer-events: none
            &_text
                pointer-events: none
            &_remove-btn
                width: 30px
                margin-left: auto
                background: none !important
                outline: none
                border: none
                cursor: pointer
                img
                    pointer-events: none
    &_add-location
        display: flex
        flex-direction: column
        align-items: center
        &_title
            font-size: 16px
        &_input
            height: 30px
            margin-right: 20px
            padding-left: 5px
            font-size: 16px
            &:focus
                border: 3px
        &_btn
            width: 50px
            cursor: pointer
        form
            margin-top: 10px
            display: flex
            align-items: center
.active
    right: 0
    top: 0
    transition: right 2s
</style>