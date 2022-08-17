<script>
    import {createEventDispatcher} from "svelte";

    export let open = false

    const dispatch = createEventDispatcher()

    function onChange() {
        dispatch("change")
    }
</script>

<div class="container">
    <button class="text-gray-500 hover:text-gray-700 cursor-pointer border-none focus:outline-none" class:open on:click={onChange}>
        <svg width=32 height=24>
            <line id="top" x1=0 y1=2  x2=32 y2=2 />
            <line id="middle" x1=0 y1=12 x2=24 y2=12 />
            <line id="bottom" x1=0 y1=22 x2=32 y2=22 />
        </svg>
    </button>
</div>

<style>
    svg {
        position: absolute;
        min-height: 24px;
        transition: transform 0.3s ease-in-out;
        left: 15px;
        bottom: 20px;
    }

    svg line {
        stroke: currentColor;
        stroke-width: 3;
        transition: transform 0.3s ease-in-out
    }

    button {
        border-radius: 0 70px 0 0;
        margin: 0!important;
        padding: 0!important;
        height: 80px;
        width: 80px;
    }

    .container{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 999;
    }

    .open svg {
        transform: scale(0.7)
    }

    .open #top {
        transform: translate(6px, 0px) rotate(45deg)
    }

    .open #middle {
        opacity: 0;
    }

    .open #bottom {
        transform: translate(-12px, 9px) rotate(-45deg)
    }
</style>