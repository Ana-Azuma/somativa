<template>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {{ title }}
        </h3>
        <p class="text-3xl font-bold mt-2" :class="valueColor">
          {{ value }}
        </p>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
      
      <div class="flex-shrink-0">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center"
          :class="iconBg"
        >
          <div 
            class="w-6 h-6 rounded-full"
            :class="iconColor"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-if="trend" class="mt-4 flex items-center">
      <span 
        class="text-sm font-medium"
        :class="trend.positive ? 'text-green-600' : 'text-red-600'"
      >
        {{ trend.positive ? '↗' : '↘' }} {{ trend.value }}
      </span>
      <span class="text-sm text-gray-500 ml-2">
        {{ trend.label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KpiCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'blue',
      validator: value => ['blue', 'green', 'yellow', 'red', 'purple'].includes(value)
    },
    trend: {
      type: Object,
      default: null
    }
  },
  
  computed: {
    valueColor() {
      const colors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        purple: 'text-purple-600'
      }
      return colors[this.color]
    },
    
    iconBg() {
      const colors = {
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        yellow: 'bg-yellow-100',
        red: 'bg-red-100',
        purple: 'bg-purple-100'
      }
      return colors[this.color]
    },
    
    iconColor() {
      const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500'
      }
      return colors[this.color]
    }
  }
}
</script>