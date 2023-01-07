'use strict';

class Neuron {
  constructor(size) {
    this.weights = [];
    for (let i = 0; i < size; i++) {
      this.weights.push((Math.random() * 2) - 1);
    }
    this.bias = (Math.random() * 2) - 1;
  };
  calculateSignal(inputs) {
    let sum = 0;
    for (let i = 0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return sum + this.bias;
  };
};

class Layer {
  constructor(nCount, wCount) {
    this.neurons = [];
    for (let i = 0; i < nCount; i++) {
      this.neurons.push(new Neuron(wCount));
    }
  };
  feedNeurons(inputs) {
    let output = [];
    for (let i = 0; i < this.neurons.length; i++) {
      output.push(this.neurons[i].calculateSignal(inputs));
    }
    return output;
  };
};

class Brain {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.layers = [];
    this.score = 1; // To avoid divide by 0
    this.fitness = 0;
    for (let i = 1; i < dimensions.length; i++) {
      this.layers.push(new Layer(dimensions[i], dimensions[i - 1]));
    }
  };
  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  };
  static rectifiedLinear(x) {
    return x <= 0 ? 0 : x;
  };
  feedForward(inputs) {
    if (inputs.length != this.dimensions[0]) {
      console.error(`Input count does not match expected!
      Expected: ${this.dimensions[0]}
      Received: ${inputs.length}`);
      return;
    }
    let outputs = inputs;
    for (let i = 0; i < this.layers.length; i++) {
      outputs = this.layers[i].feedNeurons(outputs);
      // Activation Function
      for (let j = 0; j < outputs.length; j++) {
        if (i < this.layers.length - 1) {
          outputs[j] = Brain.rectifiedLinear(outputs[j]);
        } else {
          outputs[j] = Brain.sigmoid(outputs[j]); // Sigmoid final output only
        }
      }
    }
    return outputs;
  };
};

class Species {
  constructor(populationSize, brainDimensions, mutationRate, mutationScale) {
    this.populationSize = populationSize;
    this.dimensions = brainDimensions;
    this.mutationRate = mutationRate;
    this.mutationScale = mutationScale;
    this.brains = [];
    this.generation = 0;
    this.bestScore = 0;
    this.bestId = 0;
    this.bestGeneration = 0;
    for (let i = 0; i < this.populationSize; i++) {
      this.brains.push(new Brain(this.dimensions));
    }
  };
  addScore(id, points) {
    this.brains[id].score += points;
    if (this.brains[id].score > this.bestScore) {
      this.bestScore = this.brains[id].score;
      this.bestId = id;
      this.bestGeneration = this.generation;
    }
  };
  feedForward(id, inputs) {
    return this.brains[id].feedForward(inputs);
  };
  calculateFitness() {
    let sum = 0;
    for (let i = 0; i < this.brains.length; i++) {
        sum += this.brains[i].score;
    }
    for (let i = 0; i < this.brains.length; i++) {
        this.brains[i].fitness = this.brains[i].score / sum; // Pissible divide by 0
    }
  };
  nextGeneration() {
    this.calculateFitness();
    let newBrains = [];
    for (let i = 0; i < this.brains.length; i++) {
      newBrains.push(this.mate(
        this.brains[this.pickOne()]
        ,this.brains[this.pickOne()]
      ));
    }
    this.brains = newBrains;
    this.generation += 1;
  };
  pickOne() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r -= this.brains[index].fitness;
      index += 1;
    }
    index -= 1;
    return index;
  };
  mate(brain1, brain2) {
    let newBrain = new Brain(this.dimensions);
    for (let i = 0; i < newBrain.layers.length; i++) {
      for (let j = 0; j < newBrain.layers[i].neurons.length; j++) {
        for (let k = 0; k < newBrain.layers[i].neurons[j].weights.length; k++) {
          // Pick a parent to inherit weight from
          if (Math.random() > 0.5) {
            newBrain.layers[i].neurons[j].weights[k] = brain1.layers[i].neurons[j].weights[k];
          } else {
            newBrain.layers[i].neurons[j].weights[k] = brain2.layers[i].neurons[j].weights[k];
          }
          // Mutate Weight
          if (Math.random() <= this.mutationRate * 0.01) {
            // Critical Mutation
            newBrain.layers[i].neurons[j].weights[k] = (Math.random() * 2) - 1;
          } else if (Math.random() < this.mutationRate) {
            newBrain.layers[i].neurons[j].weights[k] += this.mutationScale * Math.random() * (Math.random() < 0.5 ? -1 : 1);
            //newBrain.layers[i].neurons[j].weights[k] = Math.min(1, Math.max(-1, newBrain.layers[i].neurons[j].weights[k]))
          }
        }
        // Pick a parent to inherit Bias from
        if (Math.random() > 0.5) {
          newBrain.layers[i].neurons[j].bias = brain1.layers[i].neurons[j].bias;
        } else {
          newBrain.layers[i].neurons[j].bias = brain2.layers[i].neurons[j].bias;
        }
        // Mutate Bias
        if (Math.random() <= this.mutationRate * 0.01) {
          // Critical Mutation
          newBrain.layers[i].neurons[j].bias = (Math.random() * 2) - 1;
        } else if (Math.random() < this.mutationRate) {
          newBrain.layers[i].neurons[j].bias += this.mutationScale * Math.random() * (Math.random() < 0.5 ? -1 : 1);
          //newBrain.layers[i].neurons[j].bias = Math.min(1, Math.max(-1, newBrain.layers[i].neurons[j].bias))
        }
      }
    }
    return newBrain;
  };
  save() {
    let savedBrains = [];
    for (let i = 0; i < this.brains.length; i++) {
      let layers = [];
      for (let j = 0; j < this.brains[i].layers.length; j++) {
        let layer = [];
        for (let k = 0; k < this.brains[i].layers[j].neurons.length; k++) {
          let weights = [];
          for (let l = 0; l < this.brains[i].layers[j].neurons[k].weights.length; l++) {
            weights.push(this.brains[i].layers[j].neurons[k].weights[l]);
          }
          layer.push([weights, this.brains[i].layers[j].neurons[k].bias]);
        }
        layers.push(layer);
      }
      savedBrains.push(layers);
    }
    return savedBrains;
  };
  load(neatData) {
    for (let i = 0; i < neatData.length; i++) {
      for (let j = 0; j < neatData[i].length; j++) {
        for (let k = 0; k < neatData[i][j].length; k++) {
          for (let l = 0; l < neatData[i][j][k][0].length; l++) {
            this.brains[i].layers[j].neurons[k].weights[l] = neatData[i][j][k][0][l];
          }
          this.brains[i].layers[j].neurons[k].bias = neatData[i][j][k][1];
        }
      }
    }
  };
};