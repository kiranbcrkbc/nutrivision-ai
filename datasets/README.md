# NutriVision AI – Datasets Directory

This directory stores datasets used for training and evaluating preliminary deficiency classification models.

## Folder Organization:
- `raw/`: Raw, unaugmented image sets sorted by source/anatomical class.
- `processed/`: Resized, normalized, preprocessed tensors and train/val/test splits.
- `metadata/`: Provenance tracking, dataset licensing, class balance catalogs, and bias stratification annotations.

> [!CAUTION]
> In accordance with privacy and security rules:
> 1. Raw patient-identifiable data must never be committed to git.
> 2. All dataset additions must be registered with license and attribution in `metadata/dataset_catalog.json`.
