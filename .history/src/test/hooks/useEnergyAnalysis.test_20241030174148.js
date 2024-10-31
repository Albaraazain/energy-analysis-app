
import { renderHook, act } from '@testing-library/react-hooks';
import { useEnergyAnalysis } from '../../hooks/useEnergyAnalysis';
import { mockEnergyData, mockTimeRanges } from '../mocks/dataMocks';

describe('useEnergyAnalysis', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useEnergyAnalysis());
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeNull();
  });

  it('loads and processes data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEnergyAnalysis());
    
    act(() => {
      result.current.loadData(mockEnergyData);
    });

    await waitForNextUpdate();
    
    expect(result.current.data).toEqual(mockEnergyData);
    expect(result.current.processedData).toBeTruthy();
  });

  it('handles time range changes', () => {
    const { result } = renderHook(() => useEnergyAnalysis());
    
    act(() => {
      result.current.setTimeRange(mockTimeRanges.day);
    });

    expect(result.current.timeRange).toEqual(mockTimeRanges.day);
  });
});