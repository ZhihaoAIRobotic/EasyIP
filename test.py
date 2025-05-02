import numpy as np  
import matplotlib.pyplot as plt  
from scipy.stats import multivariate_normal  

def merge_gaussians_1d(means, variances, weights):  
    """  
    融合一维高斯分布  
    
    参数:  
        means: 各高斯分布的均值列表  
        variances: 各高斯分布的方差列表  
        weights: 各高斯分布的权重列表 (和为1)  
    
    返回:  
        merged_mean: 融合后高斯分布的均值  
        merged_variance: 融合后高斯分布的方差  
    """  
    # 确保权重和为1  
    weights = np.array(weights) / sum(weights)  
    means = np.array(means)  
    variances = np.array(variances)  
    
    # 计算融合后的均值  
    merged_mean = np.sum(weights * means)  
    
    # 计算融合后的方差  
    # 第一项: 加权方差  
    variance_component1 = np.sum(weights * variances)  
    # 第二项: 均值差异导致的方差增加  
    variance_component2 = np.sum(weights * (means - merged_mean)**2)  
    
    merged_variance = variance_component1 + variance_component2  
    
    return merged_mean, merged_variance  

def merge_gaussians_multivariate(means, covariances, weights):  
    """  
    融合多维高斯分布  
    
    参数:  
        means: 各高斯分布的均值向量列表  
        covariances: 各高斯分布的协方差矩阵列表  
        weights: 各高斯分布的权重列表 (和为1)  
    
    返回:  
        merged_mean: 融合后高斯分布的均值向量  
        merged_cov: 融合后高斯分布的协方差矩阵  
    """  
    # 确保权重和为1  
    weights = np.array(weights) #np.array(weights) / sum(weights)  
    means = [np.array(mean) for mean in means]  
    covariances = [np.array(cov) for cov in covariances]  
    
    # 计算融合后的均值  
    merged_mean = np.zeros_like(means[0], dtype=float)  
    for i, mean in enumerate(means):  
        merged_mean += weights[i] * mean  
    
    # 计算融合后的协方差矩阵  
    dim = len(means[0])  
    merged_cov = np.zeros((dim, dim))  
    
    # 第一项: 加权协方差  
    for i, cov in enumerate(covariances):  
        merged_cov += weights[i] * cov  
    
    # 第二项: 均值差异导致的协方差增加  
    for i, mean in enumerate(means):  
        mean_diff = mean - merged_mean  
        merged_cov += weights[i] * np.outer(mean_diff, mean_diff)  
    
    return merged_mean, merged_cov  

# 示例1：融合一维高斯分布  
def example_1d():  
    # 定义三个一维高斯分布  
    means = [0, 5, 10]  
    variances = [1, 2, 1.5]  
    weights = [0.2, 0.5, 0.3]  
    
    # 融合高斯分布  
    merged_mean, merged_variance = merge_gaussians_1d(means, variances, weights)  
    
    print(f"一维融合结果 - 均值: {merged_mean:.2f}, 方差: {merged_variance:.2f}")  
    
    # 可视化  
    x = np.linspace(-5, 15, 1000)  
    plt.figure(figsize=(10, 6))  
    
    # 绘制原始分布  
    for i in range(len(means)):  
        y = weights[i] * 1/np.sqrt(2*np.pi*variances[i]) * np.exp(-(x-means[i])**2 / (2*variances[i]))  
        plt.plot(x, y, label=f'高斯 {i+1} (μ={means[i]}, σ²={variances[i]})')  
    
    # 绘制融合后的分布  
    y_merged = 1/np.sqrt(2*np.pi*merged_variance) * np.exp(-(x-merged_mean)**2 / (2*merged_variance))  
    plt.plot(x, y_merged, 'k--', linewidth=2, label=f'融合高斯 (μ={merged_mean:.2f}, σ²={merged_variance:.2f})')  
    
    plt.title('一维高斯分布融合')  
    plt.xlabel('x')  
    plt.ylabel('概率密度')  
    plt.legend()  
    plt.grid(True)  
    plt.show()  

# 示例2：融合二维高斯分布  
def example_2d():  
    # 定义两个二维高斯分布  
    means = [  
        [0, 0],  
        [3, 3]  
    ]  
    covariances = [  
        [[1, 0.5], [0.5, 1]],  
        [[1.5, -0.7], [-0.7, 1.5]]  
    ]  
    weights = [0.5, 0.5]
    
    # 融合高斯分布  
    merged_mean, merged_cov = merge_gaussians_multivariate(means, covariances, weights)  
    
    print("二维融合结果:")  
    print(f"均值向量: {merged_mean}")  
    print(f"协方差矩阵: \n{merged_cov}")  
    
    # 可视化  
    x = np.linspace(-5, 8, 100)  
    y = np.linspace(-5, 8, 100)  
    X, Y = np.meshgrid(x, y)  
    pos = np.dstack((X, Y))  
    
    plt.figure(figsize=(12, 4))  
    
    # 绘制原始分布  
    plt.subplot(1, 3, 1)  
    Z1 = multivariate_normal.pdf(pos, mean=means[0], cov=covariances[0])  
    plt.contourf(X, Y, Z1, cmap='viridis')  
    plt.title('高斯分布 1')  
    plt.xlabel('x')  
    plt.ylabel('y')  
    
    plt.subplot(1, 3, 2)  
    Z2 = multivariate_normal.pdf(pos, mean=means[1], cov=covariances[1])  
    plt.contourf(X, Y, Z2, cmap='viridis')  
    plt.title('高斯分布 2')  
    plt.xlabel('x')  
    plt.ylabel('y')  
    
    # 绘制融合后的分布  
    plt.subplot(1, 3, 3)  
    Z_merged = multivariate_normal.pdf(pos, mean=merged_mean, cov=merged_cov)  
    plt.contourf(X, Y, Z_merged, cmap='viridis')  
    plt.title('融合后的高斯分布')  
    plt.xlabel('x')  
    plt.ylabel('y')  
    
    plt.tight_layout()  
    plt.show()  

# 运行示例  
if __name__ == "__main__":  
    example_2d()  