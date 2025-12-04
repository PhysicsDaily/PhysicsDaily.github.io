# Chapter 1: Units, Physical Quantities, and Vectors

## Learning Objectives

After studying this chapter, you will be able to: 1

- Describe the nature of physics and its relation to other sciences
- Use SI units and convert between unit systems
- Understand uncertainty and significant figures
- Use vectors and their components

---

## 1.1 The Nature of Physics

Physics is an **experimental science** that seeks to understand the fundamental laws governing nature. It provides the foundation for all natural sciences and engineering.

!!! tip "Physics in Action"
    Everything from your smartphone's GPS to nuclear power plants relies on principles discovered through physics.

---

## 1.2 SI Units

The **International System of Units (SI)** defines seven base units:

| Quantity | Unit | Symbol |
|----------|------|--------|
| Length | meter | m |
| Mass | kilogram | kg |
| Time | second | s |
| Electric Current | ampere | A |
| Temperature | kelvin | K |
| Amount of Substance | mole | mol |
| Luminous Intensity | candela | cd |

### Derived Units

Many physical quantities are expressed as combinations of base units:

$$\text{Force: } 1 \text{ N} = 1 \text{ kg} \cdot \text{m/s}^2$$

$$\text{Energy: } 1 \text{ J} = 1 \text{ N} \cdot \text{m} = 1 \text{ kg} \cdot \text{m}^2/\text{s}^2$$

### Unit Prefixes

| Prefix | Symbol | Factor |
|--------|--------|--------|
| giga | G | $10^9$ |
| mega | M | $10^6$ |
| kilo | k | $10^3$ |
| centi | c | $10^{-2}$ |
| milli | m | $10^{-3}$ |
| micro | μ | $10^{-6}$ |
| nano | n | $10^{-9}$ |

---

## 1.3 Unit Consistency and Conversions

!!! warning "Always Check Units!"
    Equations must be **dimensionally consistent**. If the units don't match on both sides, something is wrong.

### Example: Unit Conversion

Convert 60 miles per hour to meters per second:

$$60 \frac{\text{mi}}{\text{hr}} \times \frac{1.609 \text{ km}}{1 \text{ mi}} \times \frac{1000 \text{ m}}{1 \text{ km}} \times \frac{1 \text{ hr}}{3600 \text{ s}} = 26.8 \frac{\text{m}}{\text{s}}$$

---

## 1.4 Uncertainty and Significant Figures

Every measurement has some **uncertainty**. We express this through significant figures.

**Rules for Significant Figures:**

1. Non-zero digits are always significant
2. Zeros between non-zero digits are significant
3. Leading zeros are not significant
4. Trailing zeros after a decimal point are significant

!!! example "Significant Figures Examples"
    - $123.45$ → 5 significant figures
    - $0.00123$ → 3 significant figures  
    - $1.2300$ → 5 significant figures
    - $1000$ → ambiguous (use scientific notation: $1.000 \times 10^3$)

---

## 1.5 Vectors and Vector Addition

A **vector** is a quantity that has both magnitude and direction. We denote vectors with arrows or bold letters: $\vec{A}$ or **A**.

### Vector Components

Any vector in 2D can be written in terms of its components:

$$\vec{A} = A_x \hat{i} + A_y \hat{j}$$

Where:

- $A_x = A \cos\theta$ (x-component)
- $A_y = A \sin\theta$ (y-component)
- $A = |\vec{A}| = \sqrt{A_x^2 + A_y^2}$ (magnitude)
- $\theta = \tan^{-1}\left(\frac{A_y}{A_x}\right)$ (direction)

### Vector Addition

To add vectors, add their components:

$$\vec{C} = \vec{A} + \vec{B}$$

$$C_x = A_x + B_x$$
$$C_y = A_y + B_y$$

---

## 1.6 Unit Vectors

**Unit vectors** have magnitude 1 and point in a specific direction:

- $\hat{i}$ points in the +x direction
- $\hat{j}$ points in the +y direction  
- $\hat{k}$ points in the +z direction

Any vector can be written as:

$$\vec{A} = A_x \hat{i} + A_y \hat{j} + A_z \hat{k}$$

---

## 1.7 Products of Vectors

### Scalar (Dot) Product

The dot product gives a scalar:

$$\vec{A} \cdot \vec{B} = AB\cos\phi = A_x B_x + A_y B_y + A_z B_z$$

Where $\phi$ is the angle between the vectors.

!!! note "Physical Meaning"
    The dot product tells us how much two vectors point in the same direction. Used in calculating work: $W = \vec{F} \cdot \vec{d}$

### Vector (Cross) Product

The cross product gives a vector perpendicular to both:

$$|\vec{A} \times \vec{B}| = AB\sin\phi$$

$$\vec{A} \times \vec{B} = \begin{vmatrix} \hat{i} & \hat{j} & \hat{k} \\ A_x & A_y & A_z \\ B_x & B_y & B_z \end{vmatrix}$$

!!! note "Right-Hand Rule"
    Point your fingers in the direction of $\vec{A}$, curl them toward $\vec{B}$, and your thumb points in the direction of $\vec{A} \times \vec{B}$.

---

## Summary

!!! abstract "Key Takeaways"
    1. **SI Units** form the foundation of physics measurements
    2. **Dimensional analysis** helps verify equation correctness
    3. **Vectors** have both magnitude and direction
    4. **Components**: $A_x = A\cos\theta$, $A_y = A\sin\theta$
    5. **Dot product**: $\vec{A} \cdot \vec{B} = AB\cos\phi$ (scalar result)
    6. **Cross product**: $|\vec{A} \times \vec{B}| = AB\sin\phi$ (vector result)

---

## Practice Problems

??? question "Problem 1: Unit Conversion"
    Convert $9.8 \text{ m/s}^2$ to $\text{km/hr}^2$.
    
    ??? success "Solution"
        $$9.8 \frac{\text{m}}{\text{s}^2} \times \frac{1 \text{ km}}{1000 \text{ m}} \times \left(\frac{3600 \text{ s}}{1 \text{ hr}}\right)^2 = 127,008 \frac{\text{km}}{\text{hr}^2}$$

??? question "Problem 2: Vector Addition"
    Vector $\vec{A}$ has magnitude 5.0 and points 30° above the +x axis. Vector $\vec{B}$ has magnitude 3.0 and points along the +y axis. Find $\vec{A} + \vec{B}$.
    
    ??? success "Solution"
        **Find components:**
        
        $A_x = 5.0 \cos 30° = 4.33$
        
        $A_y = 5.0 \sin 30° = 2.50$
        
        $B_x = 0$, $B_y = 3.0$
        
        **Add components:**
        
        $C_x = 4.33 + 0 = 4.33$
        
        $C_y = 2.50 + 3.0 = 5.50$
        
        **Magnitude and direction:**
        
        $C = \sqrt{4.33^2 + 5.50^2} = 7.0$
        
        $\theta = \tan^{-1}(5.50/4.33) = 51.8°$
        
        $$\vec{C} = 4.33\hat{i} + 5.50\hat{j}$$ (magnitude 7.0 at 51.8° above +x axis)

---

[Next: Motion Along a Straight Line →](motion-along-straight-line.md)
