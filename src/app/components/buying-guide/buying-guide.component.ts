import { Component } from '@angular/core';

@Component({
  selector: 'buying-guide',
  templateUrl: './buying-guide.component.html',
  styleUrls: ['./buying-guide.component.css']
})
export class BuyingGuideComponent {
  currentStep = 1;

  lensTypes = [
    { name: 'Single Vision', description: 'For correcting nearsightedness, farsightedness, or astigmatism.' },
    { name: 'Progressive Lenses', description: 'For correcting near, intermediate, and distance vision without visible lines.' },
    { name: 'Blue Light Filtering', description: 'Protects your eyes from prolonged screen exposure.' },
    { name: 'Photochromic', description: 'Lenses that darken in sunlight and become clear indoors.' }
  ];

  frameMaterials = [
    { name: 'Plastic', description: 'Lightweight, affordable, and available in various colors.' },
    { name: 'Metal', description: 'Durable and sleek, often made of titanium or stainless steel.' },
    { name: 'Acetate', description: 'Premium plastic frames with vibrant colors and patterns.' },
    { name: 'Wood', description: 'Eco-friendly and stylish, but less common.' }
  ];

  faceShapes = [
    { shape: 'Round', recommendation: 'Angular and rectangular frames to add definition.' },
    { shape: 'Square', recommendation: 'Round or oval frames to soften strong angles.' },
    { shape: 'Oval', recommendation: 'Most frame shapes suit this balanced face.' },
    { shape: 'Heart', recommendation: 'Lightweight, rimless, or oval frames to balance the broad forehead.' }
  ];

  ageGroups = [
    { group: 'Kids', advice: 'Choose lightweight, flexible frames with impact-resistant lenses.' },
    { group: 'Teens', advice: 'Trendy and durable frames for active lifestyles.' },
    { group: 'Adults', advice: 'Comfortable, professional designs with blue light filtering.' },
    { group: 'Seniors', advice: 'Lightweight frames with larger lenses for better vision coverage.' }
  ];

  careTips = [
    'Always use a microfiber cloth to clean your lenses.',
    'Avoid using harsh chemicals or tissues on your lenses.',
    'Store your specs in a hard case when not in use.',
    'Regularly tighten screws to ensure frames remain secure.'
  ];

  nextStep() {
    if (this.currentStep < 5) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
}
